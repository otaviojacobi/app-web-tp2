<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="danger" class="mb-4">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">Pari Hippique Etudiant</b-navbar-brand>
    </b-navbar>
    <b-container>
      <b-row>
        <b-col cols="4">
          <b-form @submit="addPari">
            <b-form-group id="author" label="Votre nom :" label-for="author">
              <b-form-input id="author" v-model="form.author" :disabled="isInputNameDisabled"></b-form-input>
            </b-form-group>
            <b-form-group
              id="horse"
              label="Vous pariez sur :"
              label-for="horse"
            >
             <b-form-select id="horse" v-model="form.horse" :options="horses"></b-form-select>
            </b-form-group>
            <b-button type="submit" variant="primary">Parier</b-button>
          </b-form>
          <b-button variant="info" class="mt-2"  v-on:click="generateParis">Générer des paris</b-button>
          <b-alert v-model="showErrorAlert" variant="danger" dismissible>
            {{errorMessage}}
          </b-alert>
        </b-col>
        <b-col cols="8">Liste des paris :
          <b-list-group>
            <b-list-group-item v-for="item in paris" :key="item.id">
              <template v-if="item.author === form.author">
                <b-badge variant="secondary">{{item.author}}</b-badge>
                a parié sur le cheval {{item.horse}}
                <br>
                <span class="small">{{item.date | moment("DD/MM/YYYY - hh:mm")}}</span>
                <i v-on:click="deletePari(item.id)" class="fas fa-trash-alt v-align"></i>
              </template>
              <template v-else>
                <b-badge variant="info">{{item.author}}</b-badge>
                a parié sur le cheval {{item.horse}}
                <br>
                <span class="small">{{item.date | moment("DD/MM/YYYY - hh:mm")}}</span>
              </template>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
      <hr>
      <b>Course - {{raceState}}</b>
      <hr>
      <horse-race v-bind:horses="horses" v-on:update:raceState="updateRaceState($event)"></horse-race>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import HorseRace from "./components/HorseRace";

export default {
  components: {
    HorseRace
  },
  data: function() {
    return {
      isInputNameDisabled: false,
      showErrorAlert: false,
      errorMessage: '',
      form: {
        author: '',
        horse: null,
      },
      paris: [],
      horses: [
        { value: 1, text: 'Derdas', position: 0, color: 'CadetBlue' },
        { value: 2, text: 'Man Or', position: 0, color: 'CornflowerBlue' },
        { value: 3, text: 'Mirage Hero', position: 0, color: 'Coral' },
        { value: 4, text: 'Light The Fuse', position: 0, color: 'DarkRed' },
        { value: 5, text: 'Bentley Mood', position: 0, color: 'GoldenRod' },
        { value: 6, text: 'Crew Dragon', position: 0, color: 'Khaki' },
        { value: 7, text: 'Calypso Rose', position: 0, color: 'MediumBlue' },
        { value: 8, text: 'Gavotte', position: 0, color: 'Purple' },
        { value: 9, text: 'Missy Perfect', position: 0, color: 'SeaGreen' },
        { value: 10, text: 'Redhead Lady', position: 0, color: 'SteelBlue' }
      ],
      raceState: 'En attente Paris'
    };
  },
  methods: {
    addPari: function(event) {
      event.preventDefault();

      if(this.form.author == '' || this.form.horse == null) {
        this.errorMessage = 'Form must have both your name and your betting horse',
        this.showErrorAlert = true;
        return;
      }


      axios
        .post('http://localhost:3000/paris', this.form)
        .then(_ => {
          this.isInputNameDisabled = true;
          this.loadParis();
        })
        .catch(e => {
          this.errorMessage = `We're sorry but we had an issue creating your bet. Please retry later` ,
          this.showErrorAlert = true;
          console.error(e);
        });
    },
    onReset: function(event) {},
    loadParis: function() {
      axios
        .get('http://localhost:3000/paris')
        .then(response => {
          this.paris = response.data;
        })
        .catch(e => {
          this.errorMessage = `We're sorry but we had an issue loading the bets. Please retry later` ,
          this.showErrorAlert = true;
          console.error(e);
        });
    },
    deletePari: function(id) {
      axios
        .delete(`http://localhost:3000/paris/${id}`)
        .then(_ => {
          this.paris = this.paris.filter(paris => paris.id !== id)
        })
        .catch(e => {
          this.errorMessage = `We're sorry but we had an issue deleting your bet. Please retry later` ,
          this.showErrorAlert = true;
          console.error(e);
        });
    },
    generateParis: function() {
      axios
        .post('http://localhost:3000/paris/generate')
        .then(_ => {
          this.loadParis();
        })
        .catch(e => {
          this.errorMessage = `We're sorry but we had an issue generating bets. Please retry later` ,
          this.showErrorAlert = true;
          console.error(e);
        });
    },
    updateRaceState(event){
      this.raceState = event;
      if (this.raceState === 'Terminée'){
        console.log('Gestion des paris');
      }
    }
  },
  created: function() {
    this.loadParis();
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

