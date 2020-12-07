<template>
  <div
    class="searchContainer"
    v-bind:class="{
      loading: showLoading,
      active: inputActive,
      dirty: value.length > 0,
    }"
  >
    <input
      ref="searchInput"
      autocomplete="off"
      ref:input
      type="text"
      name="searchByCity"
      class="searchByCity"
      v-on:focus="onFocus"
      v-on:input="onChange"
      v-on:blur="onBlur"
      v-on:keypress="onKeyPress"
    />
    <label>Search by City</label>
    <div class="underline"></div>
    <transition name="fade">
      <button
        v-on:click="onClick"
        v-if="value.length > 0 && !showLoading"
        class="searchByCityButton"
      >
        Search
      </button>
    </transition>
    <p v-if="isError" class="errorMessage">
      Could not find anything for your input.
    </p>
  </div>
</template>
<script>
export default {
  name: "Search",
  data() {
    return {
      value: "",
      inputActive: false,
    };
  },
  props: {
    showLoading: Boolean,
    isError: Boolean,
  },
  methods: {
    onFocus() {
      this.inputActive = true;
      this.$emit("on-change");
    },
    onChange(e) {
      this.value = e.target.value;
    },
    onKeyPress(e) {
      if (e.key === "Enter") {
        this.$emit("on-key-press", e.target.value);
        this.$refs.searchInput.blur();
      }
    },
    onClick() {
      this.$emit("on-key-press", this.$refs.searchInput.value);
    },
    onBlur() {
      this.inputActive = false;
    },
  },
};
</script>
<style lang="scss" src="@/styles/search.scss"></style>
