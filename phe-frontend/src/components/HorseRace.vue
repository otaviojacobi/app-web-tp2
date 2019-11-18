<template>
  <div id="app">
    <b-row>
      <b-col cols="4">
        <b-form-group>
          <b-button type="submit" variant="success" v-on:click="launchRace()">Lancer la course</b-button>
        </b-form-group>
        <b-form-group>
          <b-button type="submit" variant="warning" v-on:click="resetHorses()">Chevaux dans les boxs</b-button>
        </b-form-group>
      </b-col>
      <b-col cols="8">
        <ul>
          <li v-for="horse in horses" :key="horse.value">
            <span class="box">{{ horse.value }}</span>
            <i
              class="fas fa-horse"
              v-bind:style="{ color: horse.color, 'margin-left': horse.position + 'px' }"
            ></i>
            <span class="finish"></span>
          </li>
        </ul>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'horseRace',
  props: ['horses'],
  data: function() {
    return {
      interval: null
    };
  },
  methods: {
    launchRace() {
      let endOfRace = false;
      this.$emit("update:raceState", "En cours");
      this.interval = setInterval(() => {
        this.horses.forEach(horse => {
          horse.position = horse.position + Math.floor(Math.random() * 10);
          if (horse.position > 600) {
            endOfRace = true;
          }
        });
        if (endOfRace) {
          clearInterval(this.interval);
          this.$emit("update:raceState", "Terminée");
        }
      }, 100);
    },
    resetHorses: function() {
      clearInterval(this.interval);
      this.$emit("update:raceState", "En attente Paris");
      this.horses.map(h => {
        h.position = 0;
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>


<style scoped>
li {
  border: 1px solid black;
  margin-bottom: 10px;
  list-style: none;
}
span.box {
  width: 20px;
  border-right: solid 1px grey;
}
span.arrivee {
  width: 20px;
  border-left: solid 1px grey;
  display: block;
}
</style>

