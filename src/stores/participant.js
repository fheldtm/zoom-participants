import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useParticipantStore = defineStore('participant', () => {
  const participantList = ref('');
  const getParticipant = () => computed(() => participantList.value).value;
  const setParticipant = obj => participantList.value = obj;

  const startTime = ref('');
  const getStartTime = () => computed(() => startTime.value).value;
  const setStartTime = time => startTime.value = time;

  const endTime = ref('');
  const getEndTime = () => computed(() => endTime.value).value;
  const setEndTime = time => endTime.value = time;

  const result = ref([]);
  const getResult = () => computed(() => result.value).value;
  const setResult = time => result.value = time;

  const order = ref([]);
  const getOrder = () => computed(() => order.value).value;
  const setOrder = time => order.value = time;

  return {
    getParticipant,
    setParticipant,
    getStartTime,
    setStartTime,
    getEndTime,
    setEndTime,
    getResult,
    setResult,
    getOrder,
    setOrder
  };
});
