import { ScrollView, StyleSheet, Text, View, TouchableOpacity  } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'

const index = () => {

  const [headerValue, setHeaderValue] = useState("Codeforces")

  return (
    <View>
      <View style={styles.headerContainer} >
        <TouchableOpacity style={ headerValue==="Codeforces" ? styles.btnSelected : styles.btnNotSelected} onPress={() => setHeaderValue("Codeforces")} >
          <Text style={ headerValue==="Codeforces" ? styles.txtSelected : styles.txtNotSelected } >Codeforces</Text>
        </TouchableOpacity>

        <TouchableOpacity style={ headerValue==="Leetcode" ? styles.btnSelected : styles.btnNotSelected} onPress={()=>setHeaderValue("Leetcode")} >
          <Text style={ headerValue==="Leetcode" ? styles.txtSelected : styles.txtNotSelected } >Leetcode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={ headerValue==="Codechef" ? styles.btnSelected : styles.btnNotSelected} onPress={() => setHeaderValue("Codechef")} >
          <Text style={ headerValue==="Codechef" ? styles.txtSelected : styles.txtNotSelected } >Codechef</Text>
        </TouchableOpacity>
      </View>

      <View>
        <ScrollView>
          <Text>item1</Text>
          <Text>item1</Text>
          <Text>item1</Text>
        </ScrollView>
      </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    alignSelf: 'center'
  },
  btnSelected: {
    backgroundColor: Colors.CORAL,
    padding: 8,
    borderRadius: 20,
    margin: 8,
    width: 90,
    alignItems: 'center'
  },
  txtSelected: {
    color: Colors.WHITE,
    fontWeight: 'bold'
  },
  btnNotSelected: {
    padding: 8,
    borderRadius: 20,
    margin: 8,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    width: 90,
    alignItems: 'center'
  },
  txtNotSelected: {
    fontWeight: 'bold',
  }
})