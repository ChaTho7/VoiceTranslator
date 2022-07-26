/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AppText from '../components/text';
import {SwipeListView} from 'react-native-swipe-list-view';
import LottieView from 'lottie-react-native';
import Voice from '@react-native-community/voice';
import {requestPermission, checkPermission} from '../utils/permissionHandler';
import {PERMISSIONS} from 'react-native-permissions';
import {showToast, toastComponent} from '../utils/toastMessage';
import {constants} from '../constants';
import translate from 'translate-google-api';
import Tts from 'react-native-tts';
import {windowDimensions} from '../utils/windowListener';
import {BaseToast} from 'react-native-toast-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import {micIcon, soundIcon, trashBinIcon, sendIcon} from '../icons';

export default function Translate({route}) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputAdded, setIsInputAdded] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showComponent, setShowComponent] = useState(false);

  const [result, setResult] = useState(' ');
  const [translateResult, setTranslateResult] = useState(' ');

  const [history, setHistory] = useState([]);
  const [itemHeight, setItemHeight] = useState(0);
  const [duplicateItemIndex, setDuplicateItemIndex] = useState(null);
  const [highlightOpacity, setHighlightOpacity] = useState(0.3);

  const [fromLang, setFromLang] = useState(route.params[0]);
  const [toLang, setToLang] = useState(route.params[1]);

  const historyRef = useRef(null);

  var timer;
  const languageVoices = {
    tr: 'tr-tr-x-tmc-network',
    fr: 'fr-fr-x-frd-network',
    en: 'en-us-x-tpd-network',
    de: 'de-de-x-deg-network',
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: constants.renaissanceGreenColor,
    },
    textInputStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(220,255,255,0.8)',
      height: 44,
      borderRadius: 20,
      paddingHorizontal: 16,
      marginHorizontal: 24,
      shadowOffset: {width: 0, height: 1},
      shadowRadius: 2,
      elevation: 2,
      shadowOpacity: 0.4,
    },
  });

  useEffect(async () => {
    let cacheHistory = await constants.cache.get(
      fromLang.shortName + '-' + toLang.shortName + 'History',
    );
    if (cacheHistory) {
      setHistory(cacheHistory);
    }

    if (!(await checkPermission(PERMISSIONS.ANDROID.RECORD_AUDIO))) {
      await requestPermission(PERMISSIONS.ANDROID.RECORD_AUDIO);
    }

    Tts.getInitStatus().then(
      async () => {
        await Tts.setDefaultEngine('com.google.android.tts');
        Tts.setDucking(true);
      },
      err => {
        if (err.code === 'no_engine') {
          setShowAlert(true);
        }
      },
    );

    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
  }, []);

  useEffect(() => {
    return () => {
      Voice.cancel();
      Voice.destroy().then(() => Voice.removeAllListeners());
    };
  }, []);

  useEffect(() => {
    if (isInputAdded) {
      setResult(result.trim());
      var duplicate = checkDuplicateItem();
      if (!duplicate) {
        translateText(result.trim());
      }
      setIsInputAdded(false);
    }
  }, [isInputAdded]);

  useEffect(() => {
    if (result.length < 10 && result != ' ' && translateResult != ' ') {
      showToast({
        type: 'special',
        text1: fromLang.shortName != 'tr' ? result.replace('i', 'ı') : result,
        text2:
          toLang.shortName != 'tr'
            ? '"' + translateResult.replace('i', 'ı') + '"'
            : '"' + translateResult + '"',
        visibilityTime: 5000,
        onHide: () => {
          setTranslateResult(' ');
        },
      });
    }

    if (translateResult != ' ' && result != ' ') {
      var duplicate = checkDuplicateItem();
    }

    if (translateResult != ' ' && result != ' ' && !duplicate) {
      setShowComponent(true);
    }
  }, [translateResult]);

  useEffect(() => {
    if (showComponent) {
      setHistory([
        ...history,
        {
          from: result,
          to: translateResult,
          fromLang: fromLang.shortName,
          toLang: toLang.shortName,
          height: itemHeight,
        },
      ]);
    }
  }, [itemHeight]);

  useEffect(async () => {
    await constants.cache.set(
      fromLang.shortName + '-' + toLang.shortName + 'History',
      history,
    );
    if (showComponent) {
      setShowComponent(false);
      setItemHeight(0);
    }
  }, [history]);

  useEffect(() => {
    if (duplicateItemIndex != null) {
      highlightHistoryItem();
    }
  }, [duplicateItemIndex]);

  const onSpeechStartHandler = e => {
    setLoading(true);
  };
  const onSpeechEndHandler = e => {
    setLoading(false);
  };
  const onSpeechResultsHandler = e => {
    let text = e.value[0];
    setResult(String(text).trim());
    setIsInputAdded(true);
  };

  const startRecording = async () => {
    try {
      setResult(' ');
      await Voice.start(
        fromLang.shortName +
          '-' +
          fromLang.shortName.charAt(0).toUpperCase() +
          fromLang.shortName.slice(1),
      );
    } catch (error) {
      console.log('error raised', error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setLoading(false);
      setResult(' ');
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const translateText = async text => {
    await translate(text, {
      from: fromLang.shortName,
      to: toLang.shortName,
    }).then(value => {
      setTranslateResult(String(value));
    });
  };
  const textToSpeech = text => {
    for (var language in languageVoices) {
      if (language === toLang.shortName) {
        Tts.setDefaultVoice(languageVoices[language]);
      }
    }
    Tts.speak(text);
  };

  const deleteHistoryItem = index => {
    let temp = [...history];
    temp.splice(index, 1);
    setHistory(temp);
  };
  const checkDuplicateItem = () => {
    var duplicate = false;
    history.map(value => {
      if (value.from == result) {
        duplicate = true;
        goHistoryIndex();
      }
    });
    return duplicate;
  };
  const goHistoryIndex = () => {
    var historyItemIndex;
    history.map((value, index) => {
      if (value.from == result) {
        historyItemIndex = index;
      }
    });

    historyRef.current.scrollToIndex({
      index: historyItemIndex,
      animated: true,
    });

    setDuplicateItemIndex(historyItemIndex);
  };
  const highlightHistoryItem = () => {
    var timerCount = 0;
    timer = setInterval(() => {
      var opacity =
        ((3 * Math.pow(timerCount, 4)) / 4 -
          6 * Math.pow(timerCount, 3) +
          (53 * Math.pow(timerCount, 2)) / 4 -
          5 * timerCount +
          3) /
        10;
      setHighlightOpacity(opacity);

      timerCount += 0.3;
      if (timerCount > 5) {
        setDuplicateItemIndex(null);
        clearInterval(timer);
      }
    }, 10);
  };

  const getComponentHeight = () => {
    if (showComponent) {
      return (
        <View
          style={{
            width: '100%',
            position: 'absolute',
            opacity: 0,
          }}>
          <View
            onLayout={event => {
              const {height} = event.nativeEvent.layout;
              setItemHeight(height);
            }}
            style={{
              paddingHorizontal: 10,
            }}>
            <BaseToast
              text1={result}
              text2={'-' + translateResult}
              style={{
                width: '100%',
                height: '100%',
                borderLeftColor: constants.darkPurpleColor,
                backgroundColor: 'rgb(220,255,255)',
              }}
              text1Style={{
                fontFamily: constants.fontFamily,
                fontSize: 20,
                fontWeight: 'normal',
                color: constants.darkPurpleColor,
                borderBottomWidth: 0.3,
                width: '100%',
              }}
              text2Style={{
                fontFamily: constants.fontFamily,
                fontSize: 15,
                color: constants.darkPurpleColor,
                width: '100%',
              }}
              text1NumberOfLines={5}
              text2NumberOfLines={10}
            />
          </View>
        </View>
      );
    }
  };

  const swapLanguages = async () => {
    let cacheHistory = await constants.cache.get(
      toLang.shortName + '-' + fromLang.shortName + 'History',
    );

    setFromLang(toLang);
    setToLang(fromLang);

    if (cacheHistory) {
      setHistory(cacheHistory);
    } else if (cacheHistory == undefined) {
      setHistory([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{
          marginTop: 5,
          marginHorizontal: 28,
          height: windowDimensions.height * 0.06,
          justifyContent: 'center',
        }}
        onPress={() => {
          setResult(' ');
          swapLanguages();
        }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: 'transparent',
          }}>
          <View
            style={{
              flex: 1,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: constants.darkCyanColor,
              backgroundColor: constants.darkPurpleColor,
            }}>
            <AppText
              style={{
                flex: 1,
                color: 'white',
                fontSize: 22,
                textAlign: 'center',
                textAlignVertical: 'center',
                shadowColor: 'transparent',
              }}>
              {fromLang.name}
            </AppText>
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <View style={{flex: 1}}>
              <LottieView
                cacheStrategy="none"
                style={{
                  transform: [{scale: 1.4}],
                  left: '12%',
                }}
                source={require('../../assets/animations/70797-arrows.json')}
                autoPlay={true}
                loop={true}
              />
            </View>
            <View
              style={{
                flex: 1,
                transform: [{rotate: '180deg'}],
              }}>
              <LottieView
                cacheStrategy="none"
                style={{
                  transform: [{scale: 1.4}],
                  left: '12%',
                }}
                source={require('../../assets/animations/70797-arrows.json')}
                autoPlay={true}
                loop={true}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: constants.darkCyanColor,
              backgroundColor: constants.darkPurpleColor,
            }}>
            <AppText
              style={{
                flex: 1,
                color: 'white',
                fontSize: 22,
                textAlign: 'center',
                textAlignVertical: 'center',
                shadowColor: 'transparent',
              }}>
              {toLang.name}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>

      <View style={[styles.textInputStyle, {marginTop: 25}]}>
        <TextInput
          value={result}
          placeholder=" "
          textAlign="center"
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          editable={!isLoading}
          onChangeText={text => {
            setResult(text);
          }}
          style={{
            flex: 1,
            color: 'black',
            fontSize: 15,
          }}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color={constants.darkCyanColor} />
        ) : isInputFocused ? (
          <TouchableOpacity onPress={() => setIsInputAdded(true)}>
            {sendIcon}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => startRecording()}>
            {micIcon}
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: 24,
            backgroundColor: constants.redColor,
            padding: 8,
            borderRadius: 4,
            width: windowDimensions.width * 0.3,
          }}
          onPress={stopRecording}>
          <AppText style={{color: 'white', alignSelf: 'center', fontSize: 20}}>
            Stop
          </AppText>
        </TouchableOpacity>
      )}

      {history.length > 0 ? (
        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
            marginRight: 10,
            marginTop: 15,
          }}
          onPress={() => {
            setHistory([]);
          }}>
          {trashBinIcon}
        </TouchableOpacity>
      ) : null}

      {getComponentHeight()}

      <View style={{flex: 1}}>
        <SwipeListView
          listViewRef={historyRef}
          style={{marginTop: 15, paddingTop: 5, paddingBottom: 20}}
          data={history}
          renderItem={({item, index}) => (
            <View
              style={{
                flex: 1,
                marginBottom: 10,
                paddingHorizontal: 10,
                opacity: index == duplicateItemIndex ? highlightOpacity : 1,
              }}>
              <BaseToast
                text1={
                  item.fromLang != 'tr'
                    ? String(item.from).replace('i', 'ı')
                    : String(item.from)
                }
                text2={
                  item.toLang != 'tr'
                    ? '- ' + String(item.to).replace('i', 'ı')
                    : '- ' + String(item.to)
                }
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  borderLeftColor: constants.darkPurpleColor,
                  backgroundColor: 'rgb(220,255,255)',
                }}
                text1Style={{
                  fontFamily: constants.fontFamily,
                  fontSize: 20,
                  fontWeight: 'normal',
                  color: constants.darkPurpleColor,
                  borderBottomWidth: 0.3,
                  width: '100%',
                }}
                text2Style={{
                  fontFamily: constants.fontFamily,
                  fontSize: 15,
                  color: constants.darkPurpleColor,
                  width: '100%',
                }}
                text1NumberOfLines={5}
                text2NumberOfLines={10}
                onPress={() => {
                  textToSpeech(item.to);
                }}
                renderTrailingIcon={() => soundIcon}
              />
            </View>
          )}
          keyExtractor={(item, index) => index}
          renderHiddenItem={({item, index}) => <View />}
          onRowOpen={(rowKey, rowMap: RowMap<any>, toValue: number) => {
            if (rowMap[rowKey.toString()].currentTranslateX < -250) {
              deleteHistoryItem(rowKey);
            }
          }}
          disableRightSwipe={true}
          rightOpenValue={1}
          closeOnRowOpen={true}
          closeOnScroll={true}
          closeOnRowPress={true}
          closeOnRowBeginSwipe={true}
          getItemLayout={(data, index) => ({
            length: data[index].height,
            offset: data[index].height * index,
            index,
          })}
        />
      </View>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        titleStyle={{fontFamily: constants.fontFamily, fontSize: 24}}
        messageStyle={{fontFamily: constants.fontFamily, fontSize: 18}}
        confirmButtonTextStyle={{
          fontFamily: constants.fontFamily,
          fontSize: 18,
        }}
        title="Couldn't fınd any TTS Engıne"
        message="Please ınstall the TTS Engıne on next page and restart app. Also, should gıve permıssıon Google to use mıcrophone for the app to work normally."
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Install"
        confirmButtonColor={constants.darkCyanColor}
        onConfirmPressed={() => {
          Tts.requestInstallEngine();
        }}
      />

      {toastComponent({})}
    </SafeAreaView>
  );
}
