<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import * as _ from 'fxjs';
import * as L from 'fxjs/Lazy';

import { useParticipantStore } from '@/stores/participant.js';
const { setResult, setOrder, getParticipant, getStartTime, getEndTime } = useParticipantStore();

const router = useRouter();

const participantList = ref('');
const startTime = ref('');
const endTime = ref('');

const result = ref([]);
const order = ref('');
watch(order, () => {
  setDatas();
});

const setDatas = () => {
  const strToTime = str => {
    const st = str.replace(/\//g, '-');
    const nst = new Date(st);
    return new Date(`2022-01-01 ${nst.getHours()}:${nst.getMinutes()}:${nst.getSeconds()}`).getTime();
  };

  const newList = _.go(
    participantList.value,
    _.filter(p => p['이름(원래 이름)'] !== '성남 청년'),
    _.map(p => (p['이름'] = (/\(.*\)/).test(p['이름(원래 이름)']) ? p['이름(원래 이름)'].split('(')[1].split(')')[0] : p['이름(원래 이름)'], p)));

  const participants = _.go(
    newList,
    lists => _.reduce((acc, p) => {
      if (!acc[p['이름']]) acc[p['이름']] = [];
      acc[p['이름']].push(p);
      return acc;
    }, {}, lists),
    Object.values,
    _.map(_.reduce((a, b) => {
      const obj = Number(a['기간(분)']) > Number(b['기간(분)']) ? a : b;
      if ((/\(.*\)/).test(b['이름(원래 이름)'])) {
        obj['이름(원래 이름)'] = b['이름(원래 이름)'];
      }
      return obj;
    })),
    _.map(p => (p['이름'] = (/\(.*\)/).test(p['이름(원래 이름)']) ? p['이름(원래 이름)'].split(' (')[0] : p['이름(원래 이름)'], p))
  );

  result.value = _.go(
    participants,
    L.filter(p => p['대기실'] !== '예'),
    L.filter(p => p['기간(분)'] >= 5),
    L.filter(p => strToTime(p['참가 시간']) >= startTime.value),
    L.filter(p => strToTime(p['참가 시간']) <= (endTime.value + 59000)),
    _.takeAll
  );

  const orders = order.value.split(',').map(o => o.trim());
  _.each(
    o => result.value.sort((a, b) => new RegExp(`^${o}`, 'g').test(b['이름']) ? -1 : 1),
    ['', ...orders].reverse()
  );

  setResult(result.value);
  setOrder(orders);
};

onMounted(() => {
  participantList.value = getParticipant();
  startTime.value = getStartTime();
  endTime.value = getEndTime();

  if (participantList.value.length === 0) {
    router.push({ name: 'Home' });
    return;
  }

  setDatas();
});
</script>

<template>
  <div class="p-10">
    <div class="mb-6">
      <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">이름 순서 설정</label>
      <input placeholder="순서(순서1, 순서2, 순서3, 순서4, ...)" v-model="order" type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    </div>
    <div class="flex justify-between mb-4">
      <RouterLink :to="{ name: 'Home' }" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">이전</RouterLink>
      <RouterLink :to="{ name: 'StepTwo' }" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">다음</RouterLink>
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">이름</th>
            <th scope="col" class="px-6 py-3">이메일</th>
            <th scope="col" class="px-6 py-3">참가시간</th>
            <th scope="col" class="px-6 py-3">나간시간</th>
            <th scope="col" class="px-6 py-3">기간(분)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="row"
            v-for="(r, i) in result"
            :key="i">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ r['이름'] }}</th>
            <td class="px-6 py-4">{{ r['사용자 이메일'] }}</td>
            <td class="px-6 py-4">{{ r['참가 시간'] }}</td>
            <td class="px-6 py-4">{{ r['나간 시간'] }}</td>
            <td class="px-6 py-4">{{ r['기간(분)'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.row:nth-child(2n - 1) {
  @apply bg-white border-b dark:bg-gray-900 dark:border-gray-700;
}
.row:nth-child(2n) {
  @apply bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700;
}
</style>