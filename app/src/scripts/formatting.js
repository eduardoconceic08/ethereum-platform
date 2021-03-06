import LZString from 'lz-string';
import marked from 'marked';
import toMarkdown from './toMarkdown.js';

marked.setOptions({
  gfm: false,
  tables: false,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: false
});

export function getContentSlug(title) {
  var slug = (title || '').toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
  if (slug.length == 0) {
    return 'content';
  }
  else {
    return slug;
  }
}

export function parseHeaders(headerStr) {
  let headers = {};
  headerStr.split('\n').forEach((header) => {
    let index = header.indexOf(':');
    if (index > 0) {
      headers[header.substr(0, index).toLowerCase()] = header.substr(index + 1);
    }
  });
  return headers;
}

export function serializeHeaders(headers) {
  return Object
    .keys(headers)
    .map((header) => `${header.toLowerCase()}:${headers[header].trim().replace(/\n/g, '')}`)
    .join('\n');
}

export function parseDocument(serializedDocument, format, compression) {
  if (format == 'markdown' && compression == 'lz-string-valid-utf16') {
    return marked(LZString.decompressFromUTF16(serializedDocument));
  }
  else {
    throw new Error('Invalid document');
  }
}

export function serializeDocument(document, format, compression) {
  if (format == 'markdown' && compression == 'lz-string-valid-utf16') {
    return LZString.compressToUTF16(toMarkdown(document));
  }
  else {
    throw new Error('Invalid document');
  }
}

export function getRandom() {
  return parseInt(Math.random() * 2147483647);
}

export function getContentProps(contentIDs, callback) {
  window.read.getContents(contentIDs, getRandom(), (error, rawProps) => {
    let contentProps = [];
    for (let i = 0; i < contentIDs.length; i++) {
      let ether = web3.toWei(1);
      let props = {
        // TODO: normalize contentID inputs around "0x" formatting
        contentID: '0x' + contentIDs[i].toString(16).replace('0x', ''),
        block: rawProps[0][i].toNumber(),
        funds: rawProps[1][i].dividedBy(ether).toNumber(),
        token: rawProps[2][i],
        publisher: rawProps[3][i],
        replyCount: rawProps[4][i].toNumber()
      };
      // Reddit decays in 45000s intervals, or 12.5hrs
      // Assuming 15s block time, 12.5hrs == 3000 blocks
      props.score = props.block / 3000;
      if (props.funds > 1) {
        props.score += Math.log(props.funds);
      }
      contentProps.push(props);
    }
    callback(null, contentProps);
  });
}

export function cacheContent(contentID, content) {
  window.contentCache[contentID] = {
    contentID: contentID,
    publisher: content.args.publisher,
    token: content.args.token,
    headers: content.args.headers,
    document: content.args.document,
    parentID: '0x' + content.args.parentID.toString(16),
    timestamp: content.args.timestamp.toNumber()
  };
}

export function getContentPosts(contentIDs, blocks, callback) {
  let loaded = 0;
  contentIDs = contentIDs.map(contentID => '0x' + contentID.toString(16).replace('0x', ''));
  for (let i = 0; i < contentIDs.length; i++) {
    let contentID = contentIDs[i];
    if (window.contentCache[contentID]) {
      if (++loaded == contentIDs.length) {
        callback(null, contentIDs.map(contentID => Object.assign({}, window.contentCache[contentID])));
      }
    }
    else {
      window.post.Content({contentID: contentID}, {fromBlock: blocks[i], toBlock: blocks[i]}).get((error, rawPost) => {
        if (rawPost && rawPost.length == 1) {
          // TODO: Save to local storage here
          cacheContent(contentID, rawPost[0]);
        }
        if (++loaded == contentIDs.length) {
          callback(null, contentIDs.map(contentID => Object.assign({}, window.contentCache[contentID])));
        }
      });
    }
  }
}

export function submitPost(title, doc, token, parentID, callback) {
  title = title || doc.innerText || '(untitled)';
  if (title.length > 140) {
    title = title.substr(0, 137).split(' ').slice(0, -1).join(' ') + '...';
  }
  let headers = {
    title: title,
    format: 'markdown',
    compression: 'lz-string-valid-utf16'
  };
  let serializedHeaders = serializeHeaders(headers);
  let serializedDocument = serializeDocument(doc, headers.format, headers.compression);
  let tx = {
    from: window.account,
    value: 0
  };
  window.post.toContentID(window.account, serializedHeaders, serializedDocument, token, parentID, (error, contentID) => {
    window.post.publish.estimateGas(serializedHeaders, serializedDocument, token, parentID, tx, (error, gasEstimate) => {
      console.log(gasEstimate);
      tx.gas = gasEstimate + 100000;
      window.post.publish(serializedHeaders, serializedDocument, token, parentID, tx, (error) => {
        callback(error, '0x' + contentID.toString(16));
      });
    });
  });
}


export function humanizeDuration(timestamp, now) {
  var result = '';
  var age = now - timestamp;
  if (age > 86400000) {
    age = Math.floor(age / 86400000);
    result += age + (age > 1 ? ' days' : ' day');
  }
  else if (age > 3600000) {
    age = Math.floor(age / 3600000);
    result += age + (age > 1 ? ' hours' : ' hour');
  }
  else if (age > 60000) {
    age = Math.floor(age / 60000);
    result += age + (age > 1 ? ' minutes' : ' minute');
  }
  else if (age > 1000) {
    age = Math.floor(age / 1000);
    result += age + (age > 1 ? ' seconds' : ' second');
  }
  return result;
}

