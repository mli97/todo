import React, {useState, useEffect} from 'react';
import { KeyboardAvoidingView, ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, Keyboard, ScrollView, TouchableWithoutFeedbackComponent } from 'react-native';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  async function saveData(updatetedTaskItems){ 
    try{
      await AsyncStorage.removeItem('task');
      const s = JSON.stringify(updatetedTaskItems);
      await AsyncStorage.setItem('task', s);
      console.log('task saved: '+ s);
    } catch(error){
      console.error(error);
    }
  }

  async function loadData(){
    try {
      const data = await AsyncStorage.getItem('task');
      if (data != null){
        setTaskItems(JSON.parse(data));
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }}

    useEffect(()=>{
      loadData();
    },[])

    const  handleAddTask = () => {
      Keyboard.dismiss();
      setTaskItems((prevItems) => {
        const updatedItems = [...prevItems, task];
        saveData(updatedItems);
        console.log(task);
        return updatedItems;
        
      });
      setTask(null);
    };
  

  const completeTask = async (index) => {
    console.log('deleting task at index', index);
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    await setTaskItems(itemsCopy);
    console.log('task items updated: ', itemsCopy);
    await saveData(itemsCopy);
  }

  function getRandomImageURL() {
    const randomWidth = Math.floor(Math.random() * 1000) + 200; // Random width between 200 and 1200
    const randomHeight = Math.floor(Math.random() * 600) + 200; // Random height between 200 and 800
    const cacheBuster = new Date().getTime(); // Add cache buster
    return `https://picsum.photos/${randomWidth}/${randomHeight}?cache=${cacheBuster}`;
  }
  const randomImageURL = getRandomImageURL();

  return (
    <ImageBackground
      source={{ uri: randomImageURL }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>
          <ScrollView style={styles.items}>
            {taskItems.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={item} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder={'Write a task'}
            value={task}
            onChangeText={text => setTask(text)}
          />
          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    paddingBottom: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {
    color: 'black',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },        
});
