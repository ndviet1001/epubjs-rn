import ePub from 'epubjs';
import React, { useState, useRef, useEffect } from 'react';
import Epub from './Epub'
import Rendition from './Rendition'
import Streamer from './Streamer'

const style = { flex: 1, width: '100%', height: '100%' }

const EpubReader = ({ url, onBookChange, onExternalLinkPress, onShouldStartLoadWithRequest, onNavigationStateChange, ...rest }) => {
  const [src, setSrc] = useState();
  const [book, setBook] = useState(book);

  const streamer = useRef();

  const _onShouldStartLoadWithRequest = (event) => {
    let r = true;
    if (event && event.url && event.url.startsWith('https://')) {
      // console.log('Called onExternalLinkPress');
      onExternalLinkPress && onExternalLinkPress(event.url)
      r = false
    }
    if (event && event.url && event.url.startsWith('http://') && !event.url.includes('localhost')) {
      // console.log('Called onExternalLinkPress');
      onExternalLinkPress && onExternalLinkPress(event.url)
      r = false
    }
    if (!r && onShouldStartLoadWithRequest !== undefined) {
      r = onShouldStartLoadWithRequest(event)
    }

    // console.log(`${r ? 'Allowed': 'Blocked'} loading of `, event?.url);
    return r;
  };

  const _onNavigationStateChange = (event) => {
    // console.log(event);
    onNavigationStateChange && onNavigationStateChange(event)
  };

  const onReady = (book) => {
    setBook(book)
    console.log('EPUB was changed to:',book?.package?.metadata?.title);
    // console.log("Metadata", book.package.metadata)
    // console.log("Table of Contents", book.toc)
  }

  useEffect(()=>{
    onBookChange && onBookChange(book)
  }, [book])

  const initialize = async () => {
    const aBook = ePub({ replacements: "none" });
    const type = aBook.determineType(url);
    if ((type === "directory") || (type === "opf")) {
      streamer?.current?.kill();
      setSrc(url)
      return;
    }
    streamer.current = new Streamer();
    const origin = await streamer?.current?.start();
    const newUrl = await streamer?.current?.get(url);
    setSrc(newUrl);
  };

  useEffect(() => {
    initialize();
    return () => {
      streamer?.current?.kill();
    }
  }, []);

  return !url ? null : <Epub
    src={src}
    flow={'scrolled'}
    style={style}
    onReady={onReady}
    backgroundColor={'#FEFEFE'}
    scalesPageToFit={false}
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    {...rest}
    onNavigationStateChange={_onNavigationStateChange}
    onShouldStartLoadWithRequest={_onShouldStartLoadWithRequest}
  />
}

export default EpubReader;

export {
  Epub,
  Rendition,
  Streamer
}
