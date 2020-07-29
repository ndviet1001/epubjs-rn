import ePub from 'epubjs';
import React, { useState, useRef, useEffect } from 'react';
import Epub from './Epub'
import Rendition from './Rendition'
import Streamer from './Streamer'

const style = { flex: 1, width: '100%', height: '100%' }

const EpubReader = ({ url,
                      onBookChange,
                      onExternalLinkPress,
                      onShouldStartLoadWithRequest,
                      onNavigationStateChange,
                      onInitStart,
                      onInitEnd,
                      onReady,
                      onError,
                      retryState,
                      ...rest }) => {
  const aBook = useRef();
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

  const _onReady = (book) => {
    setBook(book)
    console.log('EPUB was changed to:', book?.package?.metadata?.title);
    // console.log("Metadata", book.package.metadata)
    // console.log("Table of Contents", book.toc)
    onReady && onReady(book)
  }

  useEffect(()=>{
    onBookChange && onBookChange(book)
  }, [book])

  const _onError = (error) => {
    const text = `Failed to initialize stream. Use useState and pass the state value to 'retryState'. Any change to it will try to reinitialize the view. Details: ${error?.toString()}`;
    console.log(text);
    onError && onError(text)
  }

  const initialize = async (url) => {
    if (url) {
      try {
        onInitStart && onInitStart()
        console.log('Starting book init')

        streamer?.current?.kill();

        if (!aBook.current) {
          aBook.current = ePub({ replacements: "none" });
        }
        const type = aBook?.current?.determineType(url);
        if (!type) {
          _onError('Failed to determine type of document (.opf or .epub)')
          return
        }
        console.log(`Type of document: ${type}`)

        if ((type === "directory") || (type === "opf")) {
          setSrc(url)
          onInitEnd && onInitEnd();
          return;
        }

        streamer.current = new Streamer();
        const origin = await streamer?.current?.start();
        const newUrl = await streamer?.current?.get(url);
        setSrc(newUrl);

        console.log('Ending book init')
        onInitEnd && onInitEnd();
      }
      catch (e) {
        _onError(e)
      }
    }
  };

  useEffect(() => {
    if (url) {
      initialize(url);
    }
    return () => {
      streamer?.current?.kill();
    }
  }, [url, retryState]);

  return !url ? null : <Epub
    src={src}
    flow={'scrolled'}
    style={style}
    backgroundColor={'#FEFEFE'}
    scalesPageToFit={false}
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    {...rest}
    onNavigationStateChange={_onNavigationStateChange}
    onShouldStartLoadWithRequest={_onShouldStartLoadWithRequest}
    onReady={_onReady}
    onError={_onError}
  />;
}

export default EpubReader;

export {
  Epub,
  Rendition,
  Streamer
}
