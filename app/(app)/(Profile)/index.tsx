import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import Codechef from '@/components/codechef/Codechef'
import Codeforces from '@/components/codeforces/Codeforces'
import Leetcode from '@/components/leetcode/Leetcode'

const index = () => {
  const [headerValue, setHeaderValue] = useState("Codeforces")

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/bgCfSection.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={headerValue === "Codeforces" ? styles.btnSelected : styles.btnNotSelected} 
            onPress={() => setHeaderValue("Codeforces")}
          >
            <Text style={headerValue === "Codeforces" ? styles.txtSelected : styles.txtNotSelected}>
              Codeforces
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={headerValue === "Leetcode" ? styles.btnSelected : styles.btnNotSelected} 
            onPress={() => setHeaderValue("Leetcode")}
          >
            <Text style={headerValue === "Leetcode" ? styles.txtSelected : styles.txtNotSelected}>
              Leetcode
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={headerValue === "Codechef" ? styles.btnSelected : styles.btnNotSelected} 
            onPress={() => setHeaderValue("Codechef")}
          >
            <Text style={headerValue === "Codechef" ? styles.txtSelected : styles.txtNotSelected}>
              Codechef
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {
            headerValue === "Codeforces" ? <Codeforces /> : (
              headerValue === "Leetcode" ? <Leetcode /> : <Codechef />
            )
          }
        </View>
      </ImageBackground>
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
    alignSelf: 'center',
    marginTop: 40
  },
  btnSelected: {
    backgroundColor: Colors.CORAL,
    padding: 8,
    borderRadius: 20,
    margin: 8,
    width: 95,
    alignItems: 'center'
  },
  txtSelected: {
    color: Colors.WHITE,
    fontFamily: 'Gudea-Bold'
  },
  btnNotSelected: {
    padding: 8,
    borderRadius: 20,
    margin: 8,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    width: 95,
    alignItems: 'center'
  },
  txtNotSelected: {
    fontFamily: 'Gudea-Italic'
  },
  container: {
    width: '100%',
    height: '100%'
  },
  backgroundImage: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    marginTop: 10
  }
})