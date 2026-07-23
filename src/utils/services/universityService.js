import { get } from '../api';

export const universityService = {
  getAll: (filters = {}) => get('/universities', filters), // { country, minGpa, maxTuition, minIelts, program, studyLevel, scholarship, page, limit }
  getCountries: () => get('/universities/countries/list'),
  getPrograms: () => get('/universities/programs/list'),
  getById: (id) => get(`/universities/${id}`),
};
