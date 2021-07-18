<template lang="pug">
Route(path="/" component="{Dashboard}")
Route(path="users" component="{Users}")
Route(path="users/:id" component="{UsersId}")
Route(path="about" component="{About}")
</template>
<script lang="ts">
  import {Route} from 'svelte-routing';
  import Dashboard from './Dashboard.svelte';
  import Users from './Users.svelte';
  import UsersId from './UsersId.svelte';
  import About from './About.svelte';
</script>