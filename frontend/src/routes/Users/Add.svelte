<script lang="ts">
  import { Page, IconText } from '@theme/';
  let phone = '';
  let phoneMessage = '';
  const phoneChange = () => {
    if (!phone) return;
    let ph: string = phone;
    phoneMessage = '';
    ph = (ph.startsWith('+') ? '+' : '') + ph.replace(/[^0-9]/g, '').trim();
    if (!(ph.startsWith('+') || ph.startsWith('0'))) ph = '+91' + ph;
    if (ph.startsWith('+91') && ph.length > 3) ph = '+91 ' + ph.slice(3, 13);
    if (ph.startsWith('0')) {
      if (ph.length > 5) ph = ph.slice(0, 5) + '-' + ph.slice(5, 11);
      if (ph.length > 9) ph = ph.slice(0, 9) + '-' + ph.slice(9, 12);
    }
    phone = ph;
  };
</script>

<template>
  <Page heading="Create a new User" backButton>
    <div slot="top-extra">
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a href="javascript:alert('Sorry\n This feature is yet to be implemented.')" class="t-a-btn"><IconText icon="close">Clear</IconText></a>
    </div>
    <section class="t-shadow">
      <form>
        <label for="name">Name:</label>
        <input name="name" type="text" />
        <label for="phone">Phone number:</label>
        <input name="phone" title={phoneMessage} bind:value={phone} on:input={phoneChange} type="text" />
        <label for="address">Address:</label>
        <textarea name="address" />
        <input type="submit" value="Submit" class="t-btn" />
      </form>
    </section>
  </Page>
</template>

<style lang="scss">
  section {
    padding: 10px;
    margin: 10px auto;
    max-width: 400px;
    overflow: hidden;
    form {
      max-width: 300px;
      margin: 25px auto;
      label {
        display: block;
        margin-top: 1em;
        padding: 5px;
        &:first-of-type {
          margin-top: 0;
        }
      }
      input[type='text'],
      textarea {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
      }
      textarea {
        resize: none;
        height: 10em;
      }
      input[type='submit'] {
        display: block;
        text-align: center;
        margin: 20px auto;
      }
    }
  }
</style>
