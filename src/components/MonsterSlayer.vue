<template>
  <div id="game">
    <section class="text-center mb-6">
      <h1>Slay the Panic Monster!</h1>
    </section>
    <section id="monster" class="wrapper surface-card">
      <h2>Panic Monster's Health</h2>
      <div class="healthbar">
        <div class="healthbar__value" :style="monsterBarStyles"></div>
      </div>
    </section>
    <section id="player" class="wrapper surface-card">
      <h2>Your Health</h2>
      <div class="healthbar">
        <div class="healthbar__value" :style="playerBarStyles"></div>
      </div>
    </section>
    <section class="wrapper surface-card" v-if="winner">
      <h2>Game Over!</h2>
      <h3 v-if="winner === 'monster'">You lost!</h3>
      <h3 v-else-if="winner === 'player'">You won!</h3>
      <h3 v-else>It's a draw!</h3>
      <my-button @click="startGame" class="mb-5">Start New Game</my-button>
    </section>
    <section id="controls" class="flex flex-wrap justify-content-around" v-else>
      <my-button
        @click="attackMonster"
        label="ATTACK"
        class="mx-1 mt-3 p-button-danger"
      />
      <my-button
        :disabled="mayUseSpecialAttack"
        @click="specialAttackMonster"
        label=" SPECIAL ATTACK"
        class="mx-1 mt-3 p-button-danger"
      />
      <my-button
        @click="healPlayer"
        label="HEAL"
        class="mx-1 mt-3 p-button-success"
      />
      <my-button
        @click="surrender"
        label="SURRENDER"
        class="mx-1 mt-3 p-button-danger"
      />
    </section>
    <section id="log" class="wrapper surface-card">
      <h2 class="my-3">Battle Log</h2>
      <ul>
        <li v-for="logMessage in logMessages" :key="logMessage">
          <span
            :class="{
              'log--player': logMessage.actionBy === 'player',
              'log--monster': logMessage.actionBy === 'monster',
            }"
            >{{ logMessage.actionBy === "player" ? "Player" : "Monster" }}</span
          >
          <span v-if="logMessage.actionType === 'heal'">
            heals himself for
            <span class="log--heal">{{ logMessage.actionValue }}</span></span
          >
          <span v-else>
            attacks and deals
            <span class="log--damage">{{ logMessage.actionValue }}</span>
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default {
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Player lost
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Monster lost
        this.winner = "player";
      }
    },
  },
  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attack", attackValue);
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
};
</script>
<style scoped>
section {
  width: 90%;
  max-width: 35rem;
  margin: auto;
  color: rgb(235, 235, 235);
}

.healthbar {
  width: 100%;
  height: 20px;
  border: 1px solid #9bfc94;
  margin: 1rem 0;
  background: #ffffff;
}

.healthbar__value {
  background-color: #4e9640;
  width: 100%;
  height: 100%;
}

.wrapper {
  text-align: center;
  padding: 0.5rem;
  margin: 1rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 5px;
}

h2 {
  margin: 0.25rem;
  font-size: medium;
}
.p-button {
  cursor: pointer;
  color: rgb(29, 24, 24);
  font-size: 12px;
  font-weight: bold;
}

button:focus {
  outline: none;
}

button:hover,
button:active {
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
}

#log ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

#log li {
  margin: 0.5rem 0;
}

.log--player {
  color: #d400ff;
}

.log--monster {
  color: #da910b;
}

.log--damage {
  color: rgb(255, 86, 136);
}

.log--heal {
  color: rgb(38, 207, 38);
}
</style>
