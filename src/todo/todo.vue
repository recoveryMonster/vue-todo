<template>
  <section class="real-app">
    <input type="text" placeholder="接下来要去做什么？" autofocus class="add-input" @keyup.enter="addTodo">
    <Item :todo="todo" v-for="todo in filteredTodos" :key="todo.id" @del="deleteTodo"/>
    <Tab :filter="filter" :todos="todos" @toggle="toggleFilter" @clearAllCompleted="clearAllCompleted" />>
  </section>
</template>
<script>
import Item from "./items.vue";
import Tab from "./tabs.vue";
let id = 0;
export default {
  data() {
    return {
      todos: [],
      filter: "all"
    };
  },
  components: {
    Item,
    Tab
  },
  computed: {
    //获得选择的数组数据
    filteredTodos(){
      if(this.filter==='all'){
        return this.todos;
      }
      //判断选择的是否是completed得到completed的值 为true或false
      const completed=this.filter==="completed";
      //根据选择的状态  来选择数组中相关数据
      return this.todos.filter(todo=>todo.completed===completed);
    }
  },
  methods: {
    //增加todo数据
    addTodo(e) {
      //向数组头部插入信息
      this.todos.unshift({
        id: id++,
        content: e.target.value.trim(),
        completed: false
      });
      e.target.value = "";
    },
    //根据组件传递的id，删除 数组中相关数据
    deleteTodo(id){
      this.todos.splice(this.todos.findIndex(todo=>todo.id===id),1);
    },
    //根据组件的选择来获得当前的state
    toggleFilter(state){
      this.filter=state;
    },
    clearAllCompleted(){
        console.log(this.todos)
      //因为删除使用splice的话,每删除一次都会导致index重排，想要批量删除比较麻烦  因此这里使用filter过滤返回一个新数组
      this.todos=this.todos.filter(todo=>!todo.completed);
    }
  }
};
</script>
<style lang="stylus" scoped>
.real-app {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
}

.add-input {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  outline: none;
  color: inherit;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 60px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}
</style>