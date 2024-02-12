import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const db = SQLite.openDatabase('SkiList.db');

export default function ListScreen() {
    const navigation = useNavigation();
    const [list, setList] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);

    useEffect(() => {
        updateList(); // Päivitä lista aluksi, kun komponentti renderöidään
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => { // Tarkkaile kun näkymä tulee etualalle
            updateList(); // Päivitä lista aina kun näkymä tulee etualalle
        });
        return unsubscribe;
    }, [navigation]);

    const updateList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from list;', [], (_, { rows }) => {
                const items = rows._array;
                const total = items.reduce((acc, item) => acc + parseFloat(item.distance), 0);
                setList(items);
                setTotalDistance(parseFloat(total.toFixed(2))); // Päivitä kokonaismatka kahden desimaalin tarkkuudella
                console.log(totalDistance);
            });
        });
    };
    
    

    const deleteItem = (id) => {
        Alert.alert(
            '⚠️ Alert ⚠️',
            'Are you sure you want to delete this practice from your list?',
            [
                {
                    text: 'NO',
                    style: 'cancel',
                },
                {
                    text: 'YES',
                    onPress: () => {
                        db.transaction(
                            tx => {
                                tx.executeSql(`delete from list where id = ?;`, [id]);
                            }, null, updateList
                        );
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>

<LinearGradient
                // Background Linear Gradient
                colors={['rgba(255,255,255,255)', 'transparent']}
                style={styles.background}
            />

            <Image style={styles.image} source={require('./Icons/‎hiihtosovellus_lista.png')}
            />
            
            <FlatList
                style={{ marginLeft: 0, backgroundColor: 'transparent' }}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <View style={{ ...styles.listcontainer, borderBottomWidth: 1, borderBottomColor: 'white' }}><Text style={styles.text}>{item.date}, {item.place}, {item.distance} km</Text>
                    <TouchableOpacity onPress={() => deleteItem(item.id)}>
                        <Image style={{ width: 30, height: 35, marginTop: 6, marginLeft: 15 }} source={require('./Icons/delete.png')} />
                    </TouchableOpacity>
                </View>}
                data={list}
                
            />
            <Text style={styles.head}>Total Distance</Text>
            <Text style={styles.head1}> {totalDistance} km</Text>
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
    listcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'monospace',
        
    },
    head: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'serif',
        backgroundColor: '#02124A',
        width: '70%',
        borderWidth: 3,
        borderBottomWidth: 0,
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderBottomColor: '#02124A', 
    },
    head1: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 25,
        fontFamily: 'serif',
        backgroundColor: '#02124A',
        width: '70%',
        borderWidth: 3,
        borderTopWidth: 0,
        borderTopColor: '#02124A',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderBottomColor: 'white', 
        
    },
    image: {
        width: '60%',
        height: '20%',
        marginBottom: 0,
        marginTop: -10,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 320,
    },
});
