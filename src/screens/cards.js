/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {constants} from '../constants';
import AppText from '../components/text';
import LottieView from 'lottie-react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {windowDimensions} from '../utils/windowListener';
import AwesomeAlert from 'react-native-awesome-alerts';
import IntentLauncher from 'react-native-intent-launcher';
import Tts from 'react-native-tts';
import {helpIcon, languageIcon, settingsIcon, trashBinIcon} from '../icons';
import {SwipeListView} from 'react-native-swipe-list-view';

export default function Cards({navigation}) {
  const [isFirstRun, setIsFirstRun] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showEntryInfo, setShowEntryInfo] = useState(null);
  const [showCacheCleaner, setShowCacheCleaner] = useState(false);
  const [refCount, setRefCount] = useState(0);

  const [selectedFromLang, setSelectedFromLang] = useState({
    pic: ' ',
    name: ' ',
    shortName: ' ',
    voice: ' ',
  });
  const [selectedToLang, setSelectedToLang] = useState({
    pic: ' ',
    name: ' ',
    shortName: ' ',
    voice: ' ',
  });

  const [cards, setCards] = useState([]);
  const [duplicateCardIndex, setDuplicateCardIndex] = useState(null);
  const [highlightOpacity, setHighlightOpacity] = useState(0.3);

  const cardsRef = useRef(null);

  var refs = [];
  var timer;
  var helpMessage = `* Please update Google TTS engıne ıf ıt's not updated\n${'* And should gıve permıssıon Google to use mıcrophone for the app to work normally.'}`;

  const tr_pic = require('../../assets/images/turkey.png');
  const fr_pic = require('../../assets/images/france.png');
  const en_pic = require('../../assets/images/usa.png');
  const de_pic = require('../../assets/images/germany.png');

  const blur_radius = 10;
  const arrow_scale = 1.1;

  const languages = [
    {
      pic: tr_pic,
      name: 'TURKISH',
      shortName: 'tr',
      voice: 'tr-tr-x-ama-network',
    },
    {
      pic: fr_pic,
      name: 'FRENCH',
      shortName: 'fr',
      voice: 'fr-fr-x-frd-network',
    },
    {
      pic: en_pic,
      name: 'ENGLISH',
      shortName: 'en',
      voice: 'en-us-x-tpd-network',
    },
    {
      pic: de_pic,
      name: 'GERMAN',
      shortName: 'de',
      voice: 'de-de-x-deb-network',
    },
  ];

  const deleteCard = index => {
    let temp = [...cards];
    temp.splice(index, 1);
    setCards(temp);
  };
  const addCard = () => {
    let duplicate = checkDuplicateCard();

    if (!duplicate) {
      setCards([
        ...cards,
        {
          from_pic: selectedFromLang.pic,
          to_pic: selectedToLang.pic,
          from_name: selectedFromLang.name,
          to_name: selectedToLang.name,
        },
      ]);
    }
  };
  const checkDuplicateCard = () => {
    var duplicate = false;
    cards.map(card => {
      if (
        (card.from_name == selectedFromLang.name &&
          card.to_name == selectedToLang.name) ||
        (card.to_name == selectedFromLang.name &&
          card.from_name == selectedToLang.name)
      ) {
        duplicate = true;
      }
    });
    return duplicate;
  };
  const goCardIndex = () => {
    var cardIndex;
    cards.map((card, index) => {
      if (
        (card.from_name == selectedFromLang.name &&
          card.to_name == selectedToLang.name) ||
        (card.to_name == selectedFromLang.name &&
          card.from_name == selectedToLang.name)
      ) {
        cardIndex = index;
      }
    });

    cardsRef.current.scrollToIndex({
      index: cardIndex,
      animated: true,
    });

    setDuplicateCardIndex(cardIndex);
  };
  const highlightCard = () => {
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
        setDuplicateCardIndex(null);
        clearInterval(timer);
      }
    }, 10);
  };

  const addRef = ref => {
    refs.push(ref);
  };
  const resetAnimations = () => {
    refs.map(ref => {
      ref.reset();
      ref.play();
    });
  };

  useEffect(async () => {
    let isFirstRun = await constants.cache.get('isFirstRun');
    setIsFirstRun(isFirstRun);
    setShowEntryInfo(isFirstRun);
  }, []);

  useEffect(async () => {
    let cardHistory = await constants.cache.get('cardsHistory');
    if (cardHistory != undefined) {
      setCards(cardHistory);
    }
  }, []);

  useEffect(async () => {
    await constants.cache.set('cardsHistory', cards);
  }, [cards]);

  useEffect(() => {
    if (refCount != refs.length) {
      setRefCount(refs.length);
    }
  }, [refs]);

  useEffect(() => {
    if (refs.length != 0) {
      resetAnimations();
    }
  }, [refCount]);

  useEffect(() => {
    if (duplicateCardIndex != null) {
      highlightCard();
      resetAnimations();
    }
  }, [duplicateCardIndex]);

  function EntryInfo() {
    return showEntryInfo == 'true' ? (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          backgroundColor: 'rgba(58,66,86,0.7)',
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
        onTouchEnd={() => {
          setShowEntryInfo('false');
        }}>
        <LottieView
          cacheStrategy="none"
          style={{
            flex: 1,
            top: windowDimensions.height * 0.05,
            transform: [{scale: 0.9}],
          }}
          source={require('../../assets/animations/64919-swipe-gesture-left.json')}
          autoPlay={true}
          loop={true}
        />
        <AppText
          style={{
            flex: 1,
            fontSize: 30,
            bottom: windowDimensions.height * 0.22,
            width: '100%',
            alignSelf: 'flex-end',
            textAlignVertical: 'bottom',
            textAlign: 'center',
          }}>
          You can remove unnecessary translates or cards by slıdıng to left
        </AppText>
      </View>
    ) : null;
  }

  function Card({from_pic, to_pic, from_name, to_name}, index) {
    var fromLang, toLang;
    languages.forEach(language => {
      if (language.name == from_name) {
        fromLang = language;
      }
      if (language.name == to_name) {
        toLang = language;
      }
    });

    return (
      <TouchableOpacity
        style={styles.container}
        key={index}
        onPress={() =>
          navigation.navigate('TranslateScreen', [fromLang, toLang])
        }>
        <View
          style={{
            flex: 1,
            width: '100%',
            height: '90%',
            elevation: 2,
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: 'transparent',
          }}>
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '32%',
            }}>
            <AppText
              style={{
                flex: 1,
                color: 'white',
                fontSize: 20,
                textAlign: 'center',
                textAlignVertical: 'center',
                backgroundColor: 'rgba(43, 106, 106, 0.85)',
                shadowColor: 'transparent',
              }}>
              {from_name}
            </AppText>
          </View>
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}>
            <View style={{flex: 1}}>
              <LottieView
                ref={addRef}
                cacheStrategy="none"
                style={{
                  flex: 1,
                  transform: [{scale: arrow_scale}],
                  left: '10%',
                }}
                source={require('../../assets/animations/70797-arrows.json')}
                speed={showHelp ? 0 : 1}
                autoPlay={true}
                loop={true}
              />
            </View>
            <View style={{flex: 1}}>
              <LottieView
                ref={addRef}
                cacheStrategy="none"
                style={{
                  flex: 1,
                  transform: [{scale: arrow_scale}, {rotate: '90deg'}],
                  right: '10%',
                }}
                source={require('../../assets/animations/70797-arrows.json')}
                speed={showHelp ? 0 : 1}
                autoPlay={true}
                loop={true}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '32%',
            }}>
            <AppText
              style={{
                flex: 1,
                color: 'white',
                fontSize: 20,
                textAlign: 'center',
                textAlignVertical: 'center',
                backgroundColor: 'rgba(43, 106, 106, 0.85)',
                shadowColor: 'transparent',
              }}>
              {to_name}
            </AppText>
          </View>
        </View>

        <View
          style={{
            elevation: 1,
            height: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            shadowColor: 'transparent',
          }}>
          <Image
            style={{height: '100%', width: '33.33%', borderRadius: 15}}
            source={from_pic}
            blurRadius={blur_radius}
          />
          <Image
            style={{height: '100%', width: '33.33%', borderRadius: 15}}
            source={to_pic}
            blurRadius={blur_radius}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: constants.renaissanceGreenColor,
      }}>
      {EntryInfo()}

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          paddingTop: 10,
        }}>
        <TouchableOpacity
          style={{
            marginLeft: 10,
            marginTop: 5,
          }}
          onPress={() => {
            setShowCacheCleaner(true);
          }}>
          {settingsIcon}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginRight: 10,
            marginTop: 5,
          }}
          onPress={() => {
            setShowHelp(true);
            setShowEntryInfo('true');
          }}>
          {helpIcon}
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: '7%',
          width: '100%',
          marginTop: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 50,
        }}>
        <SelectDropdown
          buttonStyle={{
            backgroundColor: constants.darkIceColor,
            width: '40%',
            height: '100%',
            borderRadius: 25,
          }}
          buttonTextStyle={{
            fontFamily: constants.fontFamily,
            fontSize: 20,
            color: 'white',
          }}
          rowTextStyle={{fontFamily: constants.fontFamily, color: 'white'}}
          dropdownStyle={{
            backgroundColor: 'transparent',
          }}
          rowStyle={{
            backgroundColor: constants.darkGreyColor,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: constants.darkIceColor,
            borderBottomWidth: 0,
          }}
          data={languages}
          onSelect={(selectedItem, index) => {
            setSelectedFromLang(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
          defaultButtonText="FROM"
          dropdownIconPosition="left"
          renderDropdownIcon={(selectedItem, index) => languageIcon}
        />
        <SelectDropdown
          buttonStyle={{
            backgroundColor: constants.darkIceColor,
            width: '40%',
            height: '100%',
            borderRadius: 25,
          }}
          buttonTextStyle={{
            fontFamily: constants.fontFamily,
            fontSize: 20,
            color: 'white',
          }}
          rowTextStyle={{
            fontFamily: constants.fontFamily,
            color: 'white',
          }}
          dropdownStyle={{
            backgroundColor: 'transparent',
          }}
          rowStyle={{
            backgroundColor: constants.darkGreyColor,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: constants.darkIceColor,
            borderBottomWidth: 0,
          }}
          data={languages}
          onSelect={(selectedItem, index) => {
            setSelectedToLang(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
          defaultButtonText="TO"
          dropdownIconPosition="right"
          renderDropdownIcon={(selectedItem, index) => languageIcon}
        />
      </View>

      {selectedFromLang.name != selectedToLang.name &&
      selectedToLang.name != ' ' &&
      selectedFromLang.name != ' ' &&
      !checkDuplicateCard() ? (
        <TouchableOpacity
          style={{
            height: '6%',
            width: '24%',
            marginTop: 10,
            borderRadius: 20,
            alignItems: 'center',
            backgroundColor: constants.darkPurpleColor,
          }}
          onPress={() => addCard()}>
          <AppText
            style={{
              flex: 1,
              color: 'white',
              fontSize: 22,
              textAlignVertical: 'center',
            }}>
            ADD
          </AppText>
        </TouchableOpacity>
      ) : checkDuplicateCard() ? (
        <TouchableOpacity
          style={{
            height: '6%',
            width: '24%',
            marginTop: 10,
            borderRadius: 20,
            alignItems: 'center',
            backgroundColor: constants.darkPurpleColor,
          }}
          onPress={() => goCardIndex()}>
          <AppText
            style={{
              flex: 1,
              color: 'white',
              fontSize: 22,
              textAlignVertical: 'center',
            }}>
            ADD
          </AppText>
        </TouchableOpacity>
      ) : null}

      {cards.length > 0 ? (
        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
            marginRight: 10,
            marginTop: 10,
          }}
          onPress={() => {
            setCards([]);
          }}>
          {trashBinIcon}
        </TouchableOpacity>
      ) : null}

      <SwipeListView
        listViewRef={cardsRef}
        style={{
          flex: 1,
          width: '100%',
          marginTop: 15,
        }}
        data={cards}
        renderItem={({item, index}) => (
          <View
            style={{
              flex: 1,
              alignSelf: 'center',
              marginBottom: 25,
              width: '75%',
              opacity: index == duplicateCardIndex ? highlightOpacity : 1,
            }}>
            {Card(item, index)}
          </View>
        )}
        keyExtractor={(item, index) => index}
        renderHiddenItem={({item, index}) => <View />}
        onRowOpen={(rowKey, rowMap: RowMap<any>, toValue: number) => {
          if (rowMap[rowKey.toString()].currentTranslateX < -250) {
            deleteCard(rowKey);
          }
        }}
        disableRightSwipe={true}
        rightOpenValue={1}
        closeOnRowOpen={true}
        closeOnScroll={true}
        closeOnRowPress={true}
        closeOnRowBeginSwipe={true}
        getItemLayout={(data, index) => ({
          length: windowDimensions.height * 0.12,
          offset: windowDimensions.height * 0.12 * index,
          index,
        })}
      />

      <AwesomeAlert
        show={showHelp || isFirstRun == 'true'}
        showProgress={false}
        titleStyle={{fontFamily: constants.fontFamily, fontSize: 24}}
        messageStyle={{fontFamily: constants.fontFamily, fontSize: 18}}
        confirmButtonTextStyle={{
          fontFamily: constants.fontFamily,
          fontSize: 18,
        }}
        cancelButtonTextStyle={{
          fontFamily: constants.fontFamily,
          fontSize: 18,
        }}
        title="Do you need help ?"
        message={helpMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Google Settıngs"
        cancelText="Google TTS Engıne"
        confirmButtonColor={constants.darkCyanColor}
        cancelButtonColor={constants.darkCyanColor}
        onConfirmPressed={() => {
          IntentLauncher.startActivity({
            action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
            data: 'package:com.google.android.googlequicksearchbox',
          });
        }}
        onCancelPressed={() => {
          Tts.requestInstallEngine();
        }}
        onDismiss={async () => {
          if (isFirstRun == 'true') {
            setIsFirstRun('false');
            await constants.cache.set('isFirstRun', 'false');
          }
          setShowHelp(false);
        }}
      />

      <AwesomeAlert
        show={showCacheCleaner}
        showProgress={false}
        titleStyle={{fontFamily: constants.fontFamily, fontSize: 32}}
        title={'Cache Cleaner'}
        confirmButtonTextStyle={{
          fontFamily: constants.fontFamily,
          fontSize: 18,
        }}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText="Reset All Cache"
        confirmButtonColor={constants.darkCyanColor}
        onConfirmPressed={async () => {
          setCards([]);
          await constants.cache.clearAll();
        }}
        onDismiss={() => {
          setShowCacheCleaner(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: windowDimensions.height * 0.12,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 0,
    justifyContent: 'center',
  },
});
