<script lang="ts">
  import { action } from '@/coreService';
  import { debounce } from '@/utils';
  import Page from '@theme/Page.svelte';
  import IconText from '@theme/IconText.svelte';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  let form: HTMLFormElement;
  let phoneMessage = '';
  const validatePhone = async (phone: string) => {
    console.log(phone);
    if (!phone) return '';
    if (phone.startsWith('+91') && phone.length < 14) {
      return 'Indian phone numbers must contain 10 digits';
    }
    if (phone.startsWith('0') && phone.length < 13) {
      return 'Local landline numbers must contain 11 digits';
    }
    const clientCheck = await action('checkPhone', { phone });
    if (!clientCheck) {
      return '';
    } else {
      return 'This number is being used by ' + clientCheck;
    }
  };
  function onPhoneChange(this: HTMLInputElement) {
    validatePhone(this.value).then(val => this.setCustomValidity((phoneMessage = val)));
  }
  const onPhoneChangeDeb = debounce(onPhoneChange);
  function onPhoneInput(this: HTMLInputElement) {
    if (!this.value) return;
    let ph: string = this.value;
    ph = (ph.startsWith('+') ? '+' : '') + ph.replace(/[^0-9]/g, '').trim();
    if (!(ph.startsWith('+') || ph.startsWith('0'))) ph = '+91' + ph;
    if (ph.startsWith('+91') && ph.length > 3) ph = '+91 ' + ph.slice(3, 13);
    if (ph.startsWith('0')) {
      if (ph.length > 5) ph = ph.slice(0, 5) + '-' + ph.slice(5, 11);
      if (ph.length > 9) ph = ph.slice(0, 9) + '-' + ph.slice(9, 12);
    }
    this.value = ph;
    onPhoneChangeDeb.apply(this);
  }
  onMount(() =>
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const formData = new FormData(form);
      action('createClient', {
        name: formData.get('name') as unknown as string,
        phone: formData.get('phone') as unknown as string,
        address: formData.get('address') as unknown as string,
      }).then(val => {
        if (!val.uuid) {
          alert('Client not created');
        }
        window['svelte-router'].router?.route('/clients');
      });
    })
  );
</script>

<template>
  <Page heading="Create a new Client" backButton>
    <div slot="top-extra">
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a href={window.bURL + '/clients'} class="t-a-btn"><IconText icon="close">Close</IconText></a>
    </div>
    <section class="t-shadow">
      <form bind:this={form}>
        <label for="name">Name</label>
        <input name="name" type="text" autocomplete="off" minlength="3" required />
        <label for="phone">Phone number</label>
        <input name="phone" autocomplete="off" required on:input={onPhoneInput} on:change={onPhoneChange} type="text" />
        {#if phoneMessage}
          <div class="message" transition:slide>{phoneMessage}</div>
        {/if}
        <label for="address">Address</label>
        <textarea name="address" autocomplete="address-level4" required />
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
