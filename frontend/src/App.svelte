<script lang="ts">
	import {Container, Drawer, IconText, Nav, Confirm} from '@theme/';
	import Router from './routes/index.svelte';
	let basepath = '/';
	let url = '';
</script>
<template lang="pug">
#app
	Container
		Router
	Drawer
		a(href="/")
			IconText(icon="space_dashboard", outlined) Dashboard
		a(href="/users")
			IconText(icon="people" outlined) Users
		a(href="/about")
			IconText(icon="info", outlined) About
	Nav
		span Chit Managemnet System
		a(href="/api/logout") Logout
	Confirm
</template>