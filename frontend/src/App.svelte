<script lang="ts">
	import {Link, Router} from 'svelte-routing';
	import {Container, Drawer, IconText, Nav, Confirm} from '@theme/';
	import Routes from './routes/index.svelte';
	let basepath = '/';
</script>
<template lang="pug">
#app
	Router({basepath})
		Container
			Routes
		Drawer
			Link(to="/")
				IconText(icon="space_dashboard", outlined) Dashboard
			Link(to="/users")
				IconText(icon="people" outlined) Users
			Link(to="/about")
				IconText(icon="info", outlined) About
		Nav
			span Chit Managemnet System
			a(href="/api/logout") Logout
		Confirm
</template>