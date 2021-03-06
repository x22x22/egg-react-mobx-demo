import * as uniqueId from 'lodash.uniqueid';
import { action, computed, observable } from 'mobx';

export default class TodoList {
  @observable todos = [];
  @observable pendingRequests = 0;

  constructor(todos) {
    this.todos = todos;
  }

  @computed
  get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length;
  }

  @action
  addTodo(title) {
    this.todos.push({
      title,
      finished: false,
      id: uniqueId('key-'),
    });
  }
}
