<template>
  <div id="app">
    <nav>
      <router-link to="/geometry1">Geometry 1</router-link> |
      <router-link to="/geometry2">Geometry 2</router-link>
    </nav>
    <router-view name="geometry1" />
    <router-view name="geometry2" />
  </div>
</template>
