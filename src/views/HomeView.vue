<script setup>
import VueTimepicker from 'vue3-timepicker';
import 'vue3-timepicker/dist/VueTimepicker.css';

import csvtojson from 'csvtojson';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useParticipantStore } from '@/stores/participant.js';
const { setParticipant, setStartTime, setEndTime } = useParticipantStore();

const router = useRouter();

const inputEl = ref(null);
const startTime = ref('');
const endTime = ref('');

const onSetup = async () => {
  const file = inputEl.value.files[0];
  if (!file) {
    alert('파일을 선택해주세요.');
    return;
  }

  if (!(/[0-9]{2}:[0-9]{2}/).test(startTime.value)) {
    alert('시작시간을 입력해주세요.');
    return;
  }

  if (!(/[0-9]{2}:[0-9]{2}/).test(endTime.value)) {
    alert('종료시간을 입력해주세요.');
    return;
  }

  const getTime = time => new Date(`2022-01-01 ${time}:00`).getTime();
  if (getTime(startTime.value) >= getTime(endTime.value)) {
    alert('종료시간은 시작시간보다 늦게 설정해주세요.');
    return;
  }

  const csv = await (() => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  })();

  const obj = await csvtojson().fromString(csv);

  setParticipant(obj);
  setStartTime(getTime(startTime.value));
  setEndTime(getTime(endTime.value));

  router.push({ name: 'StepOne' });
};
</script>

<template>
  <main class="">
    <div class="flex items-center justify-center gap-2 p-5">
      <label>
        <input type="file"
          class="text-base text-grey-500 cursor-pointer
            rounded-full pr-5
            file:mr-5 file:py-2 file:px-6
            file:rounded-full file:border-0
            file:text-base file:font-medium
            file:bg-blue-100 file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700 hover:bg-blue-50"
          ref="inputEl" multiple="true" />
      </label>
      <VueTimepicker
        v-model="startTime"
        placeholder="시작시간" />
      <VueTimepicker
        v-model="endTime"
        placeholder="종료시간" />
      <button
        @click="onSetup"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold h-9 px-4">
        확인
      </button>
    </div>
  </main>
</template>
