<script lang="ts">
  import { action } from '@/api';
  import { debounce } from '@/utils';
  import { Page, IconText } from '@theme/';
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
    const userCheck = await action('checkPhone', { phone });
    if (!userCheck) {
      return '';
    } else {
      return 'This number is being used by ' + userCheck;
    }
  };
  function onPhoneChange(this: HTMLInputElement) {
    validatePhone(this.value).then(val => this.setCustomValidity((phoneMessage = val)));
  }
  const onPhoneChangeDeb = debounce(onPhoneChange, 700);
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
      action('createUser', {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
      }).then(val => {
        if (val.uuid) {
          alert('Created User');
        } else {
          alert('User not created');
        }
        window['svelte-router'].router?.route('/users');
      });
    })
  );
</script>

<template>
  <Page heading="Create a new User" backButton>
    <div slot="top-extra">
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a href="javascript:alert('Sorry\n This feature is yet to be implemented.')" class="t-a-btn"><IconText icon="close">Clear</IconText></a>
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
