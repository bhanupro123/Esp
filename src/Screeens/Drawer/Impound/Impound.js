import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TextInput, KeyboardAvoidingView, Button } from 'react-native'
import { withGlobalContext } from "../../../CustomProvider/CustomProvider";
import Fonts from "../../../Utils/Fonts";
import { generateRandomString, showAlertWithValue } from "../../../Utils/Util";
import ValueConstants from "../../../Utils/ValueConstants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { handleResponse, requestPost } from "../../../Network/NetworkOperations";
import { ServiceUrls } from "../../../Network/ServiceUrls";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Header from "../../../CustomComponents/Header";
import FDropDown from "./FDropDown";
import DropDownItem from "../../../CustomComponents/DropDownItem";
import TextInputItem from "./TextInputItem";
import RadioButtonItem from "./RadioButtonItem";
import GlobalButton from "../../../CustomComponents/GlobalButton";
import ColorConstants from "../../../Utils/ColorConstants";
import ImagesArrayItem from "./ImagesArrayItem";
import ScreenNames from "../../../Utils/ScreenNames";
import { StringConstants } from "../../../Utils/StringConstants";
const Impound = ({ ...props }) => {
    const globaldata = props.getContextGlobalData()
    const [enteredObject, setEnteredObjec] = useState({
        violationType: "",
        violationId: "",
        notes: "",
        plateNumber: "",
        state: "",
        year: "",
        make: "",
        model: "",
        color: "",
        vin: "",
        licPlateNo: false,
        pd: "",
        tow: "",
        tow_truck_id: 0,
        type: [],
        isSourceCustomised: "",
        isDestinationCustomised: "",
        sourcePropertyName: "",
        destinationPropertyName: "",
        sourcePropertyId: "",
        destinationPropertyId: "",
        towType: [],
        images: [],
        towList: [],
        makeList: [],
        classList: [{ Class: "Light" }, { Class: "Medium" }, { Class: "Heavy" }, { Class: "Motor Cycle" }],
        modelList: [],
        class: ""
    })
    const [refreshing, setrefreshing] = useState(false)
    const [error, setError] = useState("Loading...")
    const [response, setResponse] = useState(null)
    useEffect(() => {
        getImpoundData()
    }, [])

    const getImpoundData = () => {
        props.loader(true)
        let reqObj = {
            session_id: globaldata.sessionData.session_id,
            authentication_token: globaldata.sessionData.authentication_token,
            api_key: globaldata.sessionData.api_keys.get_team_members,
            tow_company_id: globaldata.sessionData.tow_company_id,
            driver_id: globaldata.sessionData.driver_id
        }
        requestPost(ServiceUrls.get_tow_truck_list, reqObj).then((res) => {
            res = handleResponse(props, res, true)
            if (res) {
                enteredObject.towList = res.tow_vehicles
                requestPost(ServiceUrls.get_veh_makes, {}).then((res) => {
                    if (res && res.status == 200) {

                        enteredObject.makeList = res.data
                        requestPost(ServiceUrls.get_impound_data, reqObj).then((res) => {
                            res = handleResponse(props, res)
                            props.loader(false)
                            if (res) {
                                setError("")
                                setResponse(res)
                            }
                            else {
                                setResponse(null)
                                setError("Network Error, pull Down to refresh.")
                            }
                        })
                    }
                    else {
                        props.loader(false)
                    }
                })
            }
        })
    }

    const onSubmit = async () => {

        if (!enteredObject.licPlateNo && !enteredObject.plateNumber) {
            showAlertWithValue(props, "Please enter plate number")
            return
        }
        if (!enteredObject.class) {
            showAlertWithValue(props, "Please select vehicle class")
            return
        }
        if (!enteredObject.state) {
            showAlertWithValue(props, "Please enter state")
            return
        }
        if (!enteredObject.make) {
            showAlertWithValue(props, "Please enter make")
            return
        }
        if (!enteredObject.model) {
            showAlertWithValue(props, "Please enter model")
            return
        }
        if (enteredObject.year && enteredObject.year.length != 4) {
            showAlertWithValue(props, "Please enter valid year")
            return
        }
        if (!enteredObject.color) {
            showAlertWithValue(props, "Please enter color")
            return
        }
        if (!enteredObject.violationType) {
            showAlertWithValue(props, "Please enter Voilation type")
            return
        }
        if (!enteredObject.pd) {
            showAlertWithValue(props, "Please enter PD number")
            return
        }
        if (!enteredObject.tow_truck_id) {
            showAlertWithValue(props, "Please select Tow truck")
            return
        }
        if (!enteredObject.sourcePropertyName) {
            showAlertWithValue(props, "Please enter source info")
            return
        }
        if (!enteredObject.destinationPropertyName) {
            showAlertWithValue(props, "Please enter destination info")
            return
        }
        // if (enteredObject.images.length < 5) {
        //     showAlertWithValue(props, "Please capture min 5 images")
        //     return
        // }
        props.loader(true)
        let imagesArray = []
        enteredObject.images.map((item) => {
            imagesArray.push({ image_data: "data:image/jpeg;base64," + item.base64 })
        })

        let reqObject = {
            session_id: globaldata.sessionData.session_id,
            authentication_token: globaldata.sessionData.authentication_token,
            api_key: globaldata.sessionData.api_keys.get_team_members,
            tow_company_id: globaldata.sessionData.tow_company_id,
            driver_id: globaldata.sessionData.driver_id,
            dispatch_notes: enteredObject.notes,
            lic_plate_no: enteredObject.plateNumber,
            violation_id: enteredObject.violationId,
            violation_notes: enteredObject.violationType,
            veh_state: enteredObject.state,
            veh_year: enteredObject.year,
            veh_make: enteredObject.make,
            veh_model: enteredObject.model,
            veh_color: enteredObject.color,
            veh_vin: enteredObject.vin,
            veh_pd: enteredObject.pd,
            src_type: (enteredObject.isSourceCustomised ? enteredObject.isSourceCustomised == "Customise" ? "0" : "1" : "0"),
            prop_id: enteredObject.sourcePropertyId,
            src_address: enteredObject.sourcePropertyName,
            dest_type: (enteredObject.isDestinationCustomised ? enteredObject.isDestinationCustomised == "Customise" ? "0" : "1" : "0"),
            lot_address_id: enteredObject.destinationPropertyId,
            dest_address: enteredObject.destinationPropertyName,
            pd_case_no: enteredObject.pd,
            images: imagesArray,
            tow_truck_id: enteredObject.tow_truck_id,
            //["Tarp", "Wrap", "Dollies"]
            is_tarp: enteredObject.type.includes("Tarp") ? 1 : 0,
            is_wrap: enteredObject.type.includes("Wrap") ? 1 : 0,
            is_dollies: enteredObject.type.includes("Dollies") ? 1 : 0
        }

        requestPost(ServiceUrls.save_impound_data, reqObject).then((res) => {
            props.loader(false)
            res = handleResponse(props, res)
            if (res) {
                showAlertWithValue(props, res.api_message)
                setTimeout(() => {
                    props.navigation.replace(ScreenNames.Impound)
                }, 100);

            }
            else {
                props.loader(false)
                reqObject.images = []
            }
        })

    }


    const renderUi = () => {

        return <View style={{ marginHorizontal: 20, paddingBottom: 30 }}>

            <View style={{
                marginTop: 10,
                paddingHorizontal: 10,
                flexDirection: 'row', backgroundColor: ColorConstants.primaryColor, alignItems: 'center'
            }}>
                <FontAwesome5
                    accessible={true}
                    color={ColorConstants.secondaryColor}
                    testID={"searchCancelButton"}
                    accessibilityLabel={"searchCancelButton"}
                    name={"car-alt"}
                    size={30}
                    style={{}}
                />
                <Text
                    style={{
                        padding: 10,
                        color: ColorConstants.white,
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: (ValueConstants.size22)
                    }}
                >
                    Vehicle Info
                </Text>
            </View>
            <TextInputItem
                header
                regX={StringConstants.nonOnlyAlphaNumeric}
                value={enteredObject.plateNumber}
                level={2}
                placeholder="Vehicle Plate Number"
                onChangeText={(text) => {
                    enteredObject.plateNumber = text
                }}
            />
            <FDropDown
                header
                enteredObject={enteredObject}
                level={1}
                objKey={"Class"}
                placeholder="Class"
                arrayData={enteredObject.classList}
                selectedItem={""}
                onChangeText={(text) => {
                    enteredObject.class = text
                }}
                {...props}
            />
            <TextInputItem
                header
                level={2}
                regX={StringConstants.nonOnlyAlphaNumeric}
                value={enteredObject.state}
                placeholder="State"
                onChangeText={(text) => {
                    enteredObject.state = text
                }}
            />
            <TextInputItem
                header
                regX={StringConstants.nonNumbers}
                keyboardType={'number-pad'}
                maxLength={4}
                placeholder="Year"
                value={enteredObject.year}
                onChangeText={(text) => {
                    enteredObject.year = text
                }}
            />
            <RadioButtonItem
                onSetSelected={(value) => {
                    enteredObject.licPlateNo = value ? true : false
                }}
                placeholder=""
                objKey={""}
                enableUI={false}
                buttonsHeader={["No Licence Plate Number ?"]}
                arrayData={[]}
            >
            </RadioButtonItem>
            <FDropDown
                header
                haveChild
                enteredObject={enteredObject}
                level={1}
                objKey={"Make"}
                placeholder="Make"
                arrayData={enteredObject.makeList}
                selectedItem={""}
                onChangeInnerText={(text) => {
                    enteredObject.model = text
                }}
                onChangeText={(text) => {
                    enteredObject.make = text
                }}
                {...props}
            />


            <TextInputItem
                header
                level={2}
                regX={StringConstants.nonOnlyAlphaNumeric}
                placeholder="Color"
                value={enteredObject.color}
                onChangeText={(text) => {
                    enteredObject.color = text
                }}
            />

            <TextInputItem
                header
                regX={StringConstants.nonOnlyAlphaNumeric}
                placeholder="VIN Number"
                value={enteredObject.vin}
                onChangeText={(text) => {
                    enteredObject.vin = text
                }}
            />

            {/* ///tow/////////////////////////// */}

            <View style={{
                marginTop: 10,
                paddingHorizontal: 10,
                flexDirection: 'row', backgroundColor: ColorConstants.primaryColor, alignItems: 'center'
            }}>
                <MaterialCommunityIcons
                    color={ColorConstants.secondaryColor}
                    name={"tow-truck"}
                    size={30}
                    style={{ alignSelf: "center", marginRight: 10, }}
                />
                <Text
                    style={{
                        padding: 10,
                        color: ColorConstants.white,
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: (ValueConstants.size22)
                    }}
                >
                    Towing Info
                </Text>
            </View>

            <FDropDown
                header
                level={2}
                value={enteredObject.violationType}
                idKey={"vioalation_id"}
                objKey={"violation_notes"}
                placeholder="Violation type"
                arrayData={response.violations}
                selectedItem={""}
                onChangeText={(text, id) => {
                    enteredObject.violationId = id
                    enteredObject.violationType = text
                }}
                {...props}
            />


            <TextInputItem
                header
                level={2}
                trim={false}
                value={enteredObject.pd}
                placeholder="PD Number"
                onChangeText={(text) => {
                    enteredObject.pd = text
                }}
            />

            <TextInputItem
                header
                multiline
                trim={false}
                placeholder="Notes"
                value={enteredObject.notes}
                onChangeText={(text) => {
                    enteredObject.notes = text
                }}
            />

            <DropDownItem
                header
                idKey={"id"}
                objKey={'Vehicle_Plate'}
                value={enteredObject.tow}
                placeholder="Tow Truck"
                onChangeText={(text, id = 0) => {
                    enteredObject.tow_truck_id = id
                    enteredObject.tow = text
                }}
                arrayData={enteredObject.towList}
                key={generateRandomString()} {...props}>
            </DropDownItem>
            <RadioButtonItem
                placeholder="Tarp / Wrap / Dollies"
                objKey={""}
                multiline
                enableUI={false}
                onSetSelected={(text) => {
                    enteredObject.type = text
                }}
                buttonsHeader={["Tarp", "Wrap", "Dollies"]}
                arrayData={[]}
            >
            </RadioButtonItem>



            <View style={{
                marginTop: 10,
                paddingHorizontal: 10,
                flexDirection: 'row', backgroundColor: ColorConstants.primaryColor, alignItems: 'center'
            }}>
                <MaterialCommunityIcons
                    color={ColorConstants.secondaryColor}
                    name={"location-enter"}
                    size={30}
                    style={{ alignSelf: "center", marginRight: 10, }}
                />
                <Text
                    style={{
                        padding: 10,
                        color: ColorConstants.white,
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: (ValueConstants.size22)
                    }}
                >
                    Source Info
                </Text>
            </View>
            <RadioButtonItem
                onChangeText={(text, id = "") => {
                    enteredObject.sourcePropertyId = id
                    enteredObject.sourcePropertyName = text
                }}
                onSetSelected={(text) => {
                    enteredObject.isSourceCustomised = text
                    enteredObject.sourcePropertyId = 0
                    enteredObject.sourcePropertyName = ""

                }}
                objKey={"Prop_name"}
                idKey={"Prop_id"}
                arrayData={response.properties}
                buttonsHeader={["Property Name", "Customise"]}
            >
            </RadioButtonItem>

            <View style={{
                marginTop: 10,
                paddingHorizontal: 10,
                flexDirection: 'row', backgroundColor: ColorConstants.primaryColor, alignItems: 'center'
            }}>
                <MaterialCommunityIcons
                    color={ColorConstants.secondaryColor}
                    name={"location-exit"}
                    size={30}
                    style={{ alignSelf: "center", marginRight: 10, }}
                />
                <Text
                    style={{
                        padding: 10,
                        color: ColorConstants.white,
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: (ValueConstants.size22)
                    }}
                >
                    Destination Info
                </Text>
            </View>

            <RadioButtonItem
                idKey={"address_id"}
                onChangeText={(text, id = "") => {
                    enteredObject.destinationPropertyId = id
                    enteredObject.destinationPropertyName = text
                }}
                onSetSelected={(text) => {
                    enteredObject.isDestinationCustomised = text
                    enteredObject.destinationPropertyName = 0
                    enteredObject.destinationPropertyId = ""
                }}
                objKey={"address_name"}
                buttonsHeader={["LOT", "Customise"]}
                arrayData={response.lot_addresses}
            >
            </RadioButtonItem>

            <View style={{
                marginTop: 10,
                paddingHorizontal: 10,
                flexDirection: 'row', backgroundColor: ColorConstants.primaryColor, alignItems: 'center'
            }}>
                <MaterialCommunityIcons
                    color={ColorConstants.secondaryColor}
                    name={"image"}
                    size={30}
                    style={{ alignSelf: "center", marginRight: 10, }}
                />
                <Text
                    style={{
                        padding: 10,
                        color: ColorConstants.white,
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: (ValueConstants.size22)
                    }}
                >
                    Images
                </Text>
            </View>
            <ImagesArrayItem {...props}
                source={enteredObject}
                onChangedText={(data) => {
                    enteredObject.images = data
                }}></ImagesArrayItem>

            <GlobalButton title="Next" style={{ marginTop: 60 }}
                onPress={async () => {
                    onSubmit()
                }}

            >

            </GlobalButton>

        </View >
    }
    return <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }}>
        <Header {...props} globaldata={globaldata}></Header>

        <ScrollView style={{ flex: 1 }} automaticallyAdjustKeyboardInsets
            keyboardShouldPersistTaps={'handled'}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => {

                    getImpoundData()
                }} />
            }
        >
            {error ? <Text
                style={{
                    textAlign: 'center',
                    marginVertical: 10,
                    color: "#ff0000",
                    fontFamily: Fonts.Mulish_SemiBold,
                    fontSize: (ValueConstants.size18)
                }}
            >
                {error}
            </Text> : null}
            {/* {Array.from(Array(10).keys()).map((item, index) => {
                return <TextInput key={item + index}
                    placeholder={new Date().toLocaleTimeString() + " " + index}
                    style={{ margin: 20, backgroundColor: generateRandomColor(), borderBottomWidth: 1 }}></TextInput>

            })} */}
            {/* {response && Array.from(Array(20).keys()).map((item, index) => {
                return <FDropDown showTimeZoneError={showTimeZoneError}
                    key={"damn" + item + index}
                    arrayData={response.violations}
                    selectedItem={""}
                    onSetSelected={() => {

                    }} {...props}

                />

            })} */}
            {response && response.violations ? renderUi() : null}
        </ScrollView>




    </KeyboardAvoidingView>
}

export default withGlobalContext(Impound)
