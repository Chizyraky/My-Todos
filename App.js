import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Alert, TextInput, Text } from 'react-native';
import { CheckBox, Button, ListItem, Icon } from 'react-native-elements';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');

  const addTask = () => {
    if (taskTitle.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    setTasks([...tasks, { id: Date.now().toString(), title: taskTitle, status: false }]);
    setTaskTitle('');
  };

  const toggleTaskStatus = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, status: !task.status } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
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
            containerStyle={item.status ? styles.completedTaskContainer : styles.taskContainer}
          >
            <CheckBox
              checked={item.status}
              onPress={() => toggleTaskStatus(item.id)}
            />
            <ListItem.Content>
              <ListItem.Title style={item.status ? styles.completed : null}>
                {item.title}
              </ListItem.Title>
              <ListItem.Subtitle>
                {item.status ? 'done' : 'due'}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="delete" onPress={() => deleteTask(item.id)} />
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
