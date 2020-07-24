import React, { useState, useRef, useEffect } from 'react';
import Epub from './Epub'
import Rendition from './Rendition'
import Streamer from './Streamer'

const style = { flex: 1, width: '100%', height: '100%' }

const EpubReader = ({ url, ...rest }) => {
  const [src, setSrc] = useState();

  const streamer = useRef();

  const onPress = (props) => {
    __DEV__ && console.log(props);
  };

  const onDoublePress = (props) => {
    __DEV__ && console.log(props);
  };

  const onLongPress = (props) => {
    __DEV__ && console.log(props);
  };

  const onSelected = (props) => {
    __DEV__ && console.log(props);
  };

  const onMarkClicked = (props) => {
    __DEV__ && console.log(props);
  };

  const initialize = async () => {
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
    onPress={onPress}
    onDlbPress={onDoublePress}
    onLongPress={onLongPress}
    onSelected={onSelected}
    onMarkClicked={onMarkClicked}
    backgroundColor={'#FEFEFE'}
    scalesPageToFit={false}
    {...rest}
  />
}

export default EpubReader;

export {
  Epub,
  Rendition,
  Streamer
}
