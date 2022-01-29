import ePub from 'epubjs';
import React, { useState, useRef, useEffect } from 'react';
import Epub, { bookOptionsExtras } from './Epub';
import Rendition from './Rendition';
import Streamer from './Streamer';

const defaultStyle = { flex: 1, width: '100%', height: '100%' };

export const blockTextSelectionThemeContent = {
  body: {
    '-webkit-touch-callout': 'none' /* iOS Safari */,
    '-webkit-user-select': 'none' /* Safari */,
    '-khtml-user-select': 'none' /* Konqueror HTML */,
    '-moz-user-select': 'none' /* Firefox */,
    '-ms-user-select': 'none' /* Internet Explorer/Edge */,
    'user-select': 'none',
    '-webkit-tap-highlight-color': '#00000000',
  },
};
export const blockTextSelectionName = 'blockTextSelectionTheme';
export const blockTextSelectionThemesObject = { [blockTextSelectionName]: blockTextSelectionThemeContent };

export const flowPaginated = 'paginated';
export const flowScrolled = 'scrolled';

const EpubReader = ({
  url,
  flow,
  style,
  onBookChange,
  onExternalLinkPress,
  onShouldStartLoadWithRequest,
  onNavigationStateChange,
  onInitStart,
  onInitEnd,
  onReady,
  onError,
  retryState,
  backgroundColor = '#FEFEFE',
  themes,
  theme,
  contentInset = { top: 0, bottom: 32 },
  setRenditionRef,
  ...rest
}) => {
  const aBook = useRef();
  const [src, setSrc] = useState();
  const [book, setBook] = useState(book);

  const renditionRef = useRef();

  const streamer = useRef();

  const _setRenditionRef = (ref) => {
    renditionRef.current = ref;
    setRenditionRef && setRenditionRef(ref);
  };

  const _onShouldStartLoadWithRequest = (event) => {
    if (event?.mainDocumentURL === event?.url) {
      return true;
    }
    if (
      event &&
      event.url &&
      (event.url.startsWith('https://') || (event.url.startsWith('http://') && !event.url.includes('localhost')))
    ) {
      // console.log('Called onExternalLinkPress');
      onExternalLinkPress && onExternalLinkPress(event.url);
      return false;
    }
    if (onShouldStartLoadWithRequest !== undefined) {
      return onShouldStartLoadWithRequest(event);
    }
    return true;
  };

  const _onNavigationStateChange = (event) => {
    // console.log(event);
    onNavigationStateChange && onNavigationStateChange(event);
  };

  const _onReady = (book) => {
    setBook(book);
    console.log('EPUB was changed to:', book?.package?.metadata?.title);
    // console.log("Metadata", book.package.metadata)
    // console.log("Table of Contents", book.toc)
    onReady && onReady(book);
  };

  useEffect(() => {
    onBookChange && onBookChange(book);
  }, [book]);

  const _onError = (error) => {
    const text = `Failed to initialize stream. Use useState and pass the state value to 'retryState'. Any change to it will try to reinitialize the view. Details: ${error?.toString()}`;
    console.log(text);
    onError && onError(text);
  };

  const initialize = async (url) => {
    if (url) {
      try {
        onInitStart && onInitStart();
        // console.log('Starting book init')

        streamer?.current?.kill();

        if (!aBook.current) {
          aBook.current = ePub({ replacements: 'none', ...bookOptionsExtras });
        }
        const type = aBook?.current?.determineType(url);
        if (!type) {
          _onError('Failed to determine type of document (.opf or .epub)');
          return;
        }
        console.log(`Type of document: ${type}`);

        if (type === 'directory' || type === 'opf') {
          setSrc(url);
          onInitEnd && onInitEnd();
          return;
        }

        streamer.current = new Streamer();
        const origin = await streamer?.current?.start();
        const newUrl = await streamer?.current?.get(url);
        setSrc(newUrl);

        // console.log('Ending book init')
        onInitEnd && onInitEnd();
      } catch (e) {
        _onError(e);
      }
    }
  };

  useEffect(() => {
    if (url) {
      initialize(url).then();
    }
    return () => {
      streamer?.current?.kill();
    };
  }, [url, retryState]);

  return !url ? null : (
    <Epub
      src={src}
      flow={flow || flowScrolled}
      style={style || defaultStyle}
      backgroundColor={backgroundColor}
      scalesPageToFit={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentInset={contentInset}
      themes={themes}
      theme={theme}
      {...rest}
      setRenditionRef={_setRenditionRef}
      onNavigationStateChange={_onNavigationStateChange}
      onShouldStartLoadWithRequest={_onShouldStartLoadWithRequest}
      onReady={_onReady}
      onError={_onError}
    />
  );
};

export default EpubReader;

export { Epub, Rendition, Streamer };
