<template>
  <div>
    <b-list-group-item v-for="pari in paris" :key="pari.id">
      <template v-if="pari.author === currentAuthor">
        <b-badge variant="secondary">{{pari.author}}</b-badge>
        a parié sur le cheval {{pari.horse}}
        <br />
        <span class="small">{{pari.createdAt | moment("DD/MM/YYYY - hh:mm")}}</span>
        <i v-on:click="$emit('deletePari', pari.id)" class="fas fa-trash-alt v-align"></i>
      </template>
      <template v-else>
        <b-badge variant="info">{{pari.author}}</b-badge>
        a parié sur le cheval {{pari.horse}}
        <br />
        <span class="small">{{pari.createdAt | moment("DD/MM/YYYY - hh:mm")}}</span>
      </template>
    </b-list-group-item>
  </div>
</template>

<script>
export default {
  name: 'pari',
  props: ['paris', 'currentAuthor'],
  model: {
    event: 'deletePari'
  }
};
</script>

<style scoped>
.fas {
  margin-left: 10px;
}
.fas:hover {
  cursor: pointer;
}
.v-align {
  vertical-align: middle;
}
</style>
