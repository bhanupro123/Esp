import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, TouchableOpacity, Alert } from "react-native";
let values = [1, 2, 3, 4, 5, 6, 7, 8, null];
const TempHello = ({ navi }) => {
    const [blocks, setBlocks] = useState([]);
    const [emptyIndex, setEmptyIndex] = useState(8);

    useEffect(() => {
        getRanNum();
    }, []);

    const getRanNum = () => {
        const numbers = Array.from({ length: 8 }, (_, index) => index + 1);
        numbers.sort(() => Math.random() - 0.5);
        setBlocks(numbers);
    };

    const handleBlockPress = (index) => {
        if (isMoveValid(index)) {
            const newBlocks = [...blocks];
            newBlocks[emptyIndex] = newBlocks[index];
            newBlocks[index] = null;
            setBlocks(newBlocks);
            setEmptyIndex(index);
        }
    };

    const isMoveValid = (index) => {
        const rowDiff = Math.abs(Math.floor(index / 3) - Math.floor(emptyIndex / 3));
        const colDiff = Math.abs((index % 3) - (emptyIndex % 3));
        return (rowDiff === 1 && colDiff === 0) || (colDiff === 1 && rowDiff === 0);
    };


    return (
        <View
            style={{
                width: 430,
                height: 800,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
            }}>

            <View style={{ backgroundColor: "white", width: 335, height: 335 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", margin: 1 }}>
                    {blocks.map((block, index) => (
                        <TouchableOpacity
                            onPress={() => handleBlockPress(index)}
                            style={{
                                width: 100,
                                height: 100,
                                backgroundColor: block ? "#457" : "transparent",
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 2,
                            }}
                            key={index}
                        >
                            {block && (
                                <Text style={{ fontSize: 40, fontWeight: "bold", color: "white" }}>
                                    {block}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

        </View>

    );
};

export default TempHello;