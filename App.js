import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, TextInput, Text } from 'react-native';
import { CheckBox, Button, ListItem, Icon } from 'react-native-elements';
import Dialog from 'react-native-dialog';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasks);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (taskTitle.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    const newTask = { title: taskTitle, status: 'undone' };
    await addDoc(collection(db, 'tasks'), newTask);
    setTaskTitle('');
  };

  const toggleTaskStatus = async (id) => {
    const taskRef = doc(db, 'tasks', id);
    const task = tasks.find(task => task.id === id);
    const newStatus = task.status === 'done' ? 'undone' : 'done';
    await updateDoc(taskRef, { status: newStatus });
  };

  const confirmDeleteTask = (id) => {
    setTaskIdToDelete(id);
    setDialogVisible(true);
  };

  const handleDelete = async () => {
    await deleteTask(taskIdToDelete);
    setDialogVisible(false);
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Todos</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            containerStyle={item.status === 'done' ? styles.completedTaskContainer : styles.taskContainer}
          >
            <CheckBox
              checked={item.status === 'done'}
              onPress={() => toggleTaskStatus(item.id)}
            />
            <ListItem.Content>
              <ListItem.Title style={item.status === 'done' ? styles.completed : null}>
                {item.title}
              </ListItem.Title>
              <ListItem.Subtitle>
                {item.status === 'done' ? 'done' : 'due'}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="delete" onPress={() => confirmDeleteTask(item.id)} />
          </ListItem>
        )}
        ItemSeparatorComponent={renderSeparator}
      />
      <TextInput
        style={styles.input}
        placeholder="Add new task..."
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <Button
        title="Add Task"
        onPress={addTask}
        disabled={taskTitle.trim() === ''}
        buttonStyle={styles.addButton}
      />
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Dialog.Description>
          Do you really want to delete this task?
        </Dialog.Description>
        <Dialog.Button label="No, keep it" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Yes, delete it!" onPress={handleDelete} />
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#DEB887',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800000',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center',
    padding: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  taskContainer: {
    backgroundColor: '#ffffff',
  },
  completedTaskContainer: {
    backgroundColor: '#d3d3d3',
  },
  addButton: {
    backgroundColor: '#800000',
  },
  separator: {
    height: 1,
    backgroundColor: '#CED0CE',
  },
});
