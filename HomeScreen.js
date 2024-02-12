import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Keyboard, Alert, Image, } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Input, Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';



const db = SQLite.openDatabase('SkiList.db');

export default function App() {

    const [distance, setDistance] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
    const [list, setList] = useState([]);

    const distanceInputRef = useRef(null); // Ref syöttökentälle etäisyydelle
    const placeInputRef = useRef(null); // Ref syöttökentälle paikalle
    const dateInputRef = useRef(null); // Ref syöttökentälle päivämäärälle



    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists list (id integer primary key not null, distance decimal, place text, date text);');
        }, null, updateList);
    }, []);

    const clearInputs = () => {
        setDistance('');
        setPlace('');
        setDate('');
        // Tyhjennä syöttökentät käyttäen ref-objekteja
        distanceInputRef.current.clear();
        placeInputRef.current.clear();
        dateInputRef.current.clear();
    }

    const saveSki = () => {
        console.log('Save ski:', distance, place, date);
        db.transaction(tx => {
            tx.executeSql('insert into list (distance, place, date) values (?, ?, ?);', [distance, place, date], (_, result) => {
                console.log('insert result:', result);
                Keyboard.dismiss();
                Alert.alert("Practise saved in to list")
                clearInputs();
            });
        }, null, updateList);

    }


    const updateList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from list;', [], (_, { rows }) => {
                console.log('Select result:', rows._array);
                setList(rows._array);
            });
        });
    }






    return (
        <View style={styles.container}>

            <LinearGradient
                // Background Linear Gradient
                colors={['rgba(255,255,255,255)', 'transparent']}
                style={styles.background}
            />

            <Image style={styles.image} source={require('./Icons/‎hiihtosovellus_home.png')}
            />


            <Input placeholder=
                'Distance' label=
                'DISTANCE'
                onChangeText={(distance) => setDistance(distance)} value={distance} inputStyle={styles.input}
                labelStyle={styles.label}
                ref={distanceInputRef} />

            <Input placeholder=
                'Place' label=
                'PLACE'
                onChangeText={(place) => setPlace(place)} value={place} inputStyle={styles.input}
                labelStyle={styles.label}
                ref={placeInputRef} />

            <Input placeholder=
                'Date'
                keyboardType=
                'numeric'
                label=
                'DATE'
                onChangeText={(date) => setDate(date)} value={date} inputStyle={styles.input}
                labelStyle={styles.label}
                ref={dateInputRef} />

            <Button raised icon={{ name: 'save', color: 'black' }} onPress={saveSki} title=
                "SAVE"
                buttonStyle={styles.saveButton}
                titleStyle={{ color: 'black', fontWeight: '800' }} 

            />





        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F2394',
    },
    image: {
        width: '60%',
        height: '35%',
        marginBottom: 0,
        marginTop: -80
    },
    input: {
        color: 'white',
    },
    label: {
        color: 'white',
    },
    saveButton: {
        backgroundColor: '#D7D7DA',
        width: 250,
        height: 50,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 320,
    },


});