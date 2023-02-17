<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as _ from 'fxjs';

import { useParticipantStore } from '@/stores/participant.js';

const router = useRouter();

const { getResult, getOrder } = useParticipantStore();
const result = ref([]);
const order = ref([]);
const lists = ref({ 기타: [] });
const listArr = ref([]);

onMounted(() => {
  result.value = getResult();
  order.value = getOrder();

  if(result.value.length === 0) {
    router.push({ name: 'Home' });
    return;
  }

  _.go(
    order.value,
    _.each(o => lists.value[o] = [])
  );

  lists.value['기타'] = _.go(
    result.value,
    _.map(r => (_.each(o => new RegExp(`^${o}`).test(r['이름']) && lists.value[o].push(r), order.value), r)),
    _.reject(r => _.some(o => (new RegExp(`^${o}`).test(r['이름'])), order.value))
  );

  listArr.value = _.go(
    lists.value,
    Object.entries,
    _.map(([k, v]) => ({ title: k, values: v }))
  );

  _.each(
    o => listArr.value.sort((a, b) => new RegExp(`^${o}`, 'g').test(b.title) ? -1 : 1),
    ['', ...order.value].reverse()
  );
});
</script>

<template>
  <div class="p-10 flex flex-col gap-10">
    <p
      v-for="(list, i) in listArr"
      :key="i">
      <h2 class="font-bold leading-tight text-4xl">{{ list.title }}</h2>
      <span class="text-2xl">{{ list.values.length }}명</span>
      <ul class="grid grid-cols-5">
        <li v-for="(value, j) in list.values" :key="j">{{ value['이름'] }}</li>
      </ul>
    </p>
  </div>
</template>