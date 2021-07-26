<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let day, url, imageUrl, photographer, photographerUrl;
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  onMount(async () => {
    fetch("/api/image")
      .then((r) => r.json())
      .then((json) => {
        day = new Intl.DateTimeFormat("en-US", options).format(
          new Date(json.date)
        );
        url = json.url;
        imageUrl = json.imageUrl;
        photographer = json.photographer;
        photographerUrl = json.photographerUrl;
      });
  });
</script>

<svelte:head
  ><link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap"
    rel="stylesheet"
  />
  <meta property="og:title" content="The Daily Capybara" />
  <meta property="og:site_name" content={day} />
  <meta property="og:image" content="https://dailycapybara.com/api/thumbnail" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main>
  <div id="content">
    <h1 id="title">The Daily Capybara</h1>
    <div id="image-parent">
      {#if imageUrl}
        <img src={imageUrl} alt="Capybara" in:fade={{ duration: 100 }} />
      {/if}
    </div>
    <div id="image-information">
      <span id="day">{day}</span>
      <span id="image-credit"
        ><a href={url}>Photo</a> by
        <a href={photographerUrl}>{photographer}</a>
        on
        <a href="https://www.pexels.com/">Pexels</a></span
      >
    </div>
    <a
      id="support"
      href="https://support.worldwildlife.org/site/SPageServer?pagename=main_monthly"
      >Help support endangered species through the World Wildlife Fund. ↗</a
    >
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  #content {
    width: 100%;
    max-width: 512px;
    display: flex;
    flex-direction: column;
    align-content: center;
    text-align: center;
    padding: 16px;
  }

  #title {
    font-family: Pollyester, fantasy;
    color: #000000;
    font-size: 1em;
  }

  #image-parent {
    width: 100%;
    aspect-ratio: 1 / 1;
    margin-bottom: 16px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  #image-information {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-family: Inter, sans-serif;
  }

  #day {
    font-weight: 500;
    font-size: 0.875em;
  }

  #image-credit {
    margin-bottom: 42px;
    font-weight: 300;
    font-size: 0.5em;
    color: #1a4756;
  }

  #image-credit a {
    text-decoration: none;
  }

  #image-credit a:hover {
    text-decoration: underline;
  }

  #image-credit a:visited {
    color: #1a4756;
  }

  #support {
    color: #000000;
    max-width: 35ch;
    font-family: Inter, sans-serif;
    font-weight: 300;
    font-size: 0.875em;
    line-height: 150%;
    text-align: left;
    text-decoration: none;
  }

  #support:hover {
    text-decoration: underline;
  }

  @media (min-width: 425px) {
    main {
      font-size: 125%;
    }

    #title {
      font-size: 1.5em;
    }
  }
</style>
