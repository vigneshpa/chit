<script lang="ts">
  import { action } from '@/api';
  import { debounce } from '@/utils';
  import { Page, IconText } from '@theme/';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const nowMonth = now.getMonth();
  const nowYear = now.getFullYear();

  let form: HTMLFormElement;
  let batchInput: HTMLInputElement;
  let month: number = nowMonth + 1;
  let year: number = nowYear;
  let batch: string;
  let totalValue: number = 2000000;

  onMount(() =>
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      action('createGroup', { year, month, batch, totalValue }).then(val => {
        if (!val.uuid) {
          alert('Group not created');
        }
        window['svelte-router'].router?.route('/groups');
      });
    })
  );

  let batchMessage = '';
  function validateBatch() {
    action('checkGroup', {
      name: year + '-' + month + '-' + batch,
    }).then(val => batchInput.setCustomValidity((batchMessage = val ? 'Batch already exists' : '')));
  }
  const validateBatchDeb = debounce(validateBatch);
  function batchChange(this: HTMLInputElement) {
    this.value = this.value.toUpperCase().replace(/[^A-Z:]/g, '');
    batch = this.value;
    validateBatchDeb.bind(this)();
  }
</script>

<template>
  <Page heading="Create a new Group" backButton>
    <div slot="top-extra">
      <a href={window.bURL + '/groups'} class="t-a-btn"><IconText icon="close">Close</IconText></a>
    </div>
    <section class="t-shadow">
      <form bind:this={form}>
        <label for="year">Year</label>
        <input name="year" type="number" bind:value={year} on:input={validateBatchDeb} autocomplete="off" min="2000" max="3000" required />

        <label for="month">Month</label>
        <select name="month" type="month" bind:value={month} on:input={validateBatchDeb} autocomplete="off" required>
          {#each months as month, index}
            <option value={index + 1} selected={nowMonth === index}>{month}</option>
          {/each}
        </select>

        <label for="totalValue">Value</label>
        <input name="totalVaue" type="number" min="20" bind:value={totalValue} autocomplete="off" required />

        <label for="batch">Batch</label>
        <input bind:this={batchInput} name="batch" type="text" autocomplete="off" required maxlength="3" on:input={batchChange} />
        {#if batchMessage}
          <div class="message" transition:slide>{batchMessage}</div>
        {/if}

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
