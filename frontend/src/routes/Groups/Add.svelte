<script lang="ts">
  import { action } from '@/api';
  import { Page, IconText } from '@theme/';
  import { onMount } from 'svelte';
  let form: HTMLFormElement;
  onMount(() =>
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const formData = new FormData(form);
      action('createGroup', {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
      }).then(val => {
        if (val.uuid) {
          alert('Created Group');
        } else {
          alert('Group not created');
        }
        window['svelte-router'].router?.route('/groups');
      });
    })
  );
</script>

<template>
  <Page heading="Create a new Group" backButton>
    <div slot="top-extra">
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a href="javascript:alert('Sorry\n This feature is yet to be implemented.')" class="t-a-btn"><IconText icon="close">Clear</IconText></a>
    </div>
    <section class="t-shadow">
      <form bind:this={form}>
        <label for="month">Month</label>
        <input name="month" type="month" autocomplete="off" required />
        <label for="batch">Batch</label>
        <input name="batch" autocomplete="off" required type="text" maxlength="3" />
        <input type="submit" value="Submit" class="t-btn" />
      </form>
    </section>
  </Page>
</template>

<style lang="scss">
  section {
    padding: 10px;
    margin: 10px auto;
    max-width: 600px;
    overflow: hidden;
    form {
      max-width: 500px;
      margin: 25px auto;
    }
  }
</style>
