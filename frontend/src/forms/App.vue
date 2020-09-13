<template>
<div>
    <create-user v-if="form === 'addUser'" v-bind:key="'app'"></create-user>
    <create-group v-if="form === 'addGroup'" v-bind:key="'app'"></create-group>
</div>
</template>
<script lang="ts">
import CreateUser from "./CreateUser.vue";
import CreateGroup from "./CreateGroup.vue";
import Vue from 'vue';

const url = new URL(window.location.href);
const form = url.searchParams.get("form");
console.log(form);

export default Vue.extend({
    data:()=>{return{form};},
    components:{
        CreateUser,
        CreateGroup
    }
})
</script>