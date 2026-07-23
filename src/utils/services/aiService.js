import { get, post } from '../api';

export const aiService = {
  getUniversityMatch: (payload) => post('/ai/university-match', payload), // { cgpa, ielts, budget, country, subject }
  getRecommendation: () => get('/ai/recommend'),
  getAdmissionOddsAnalysis: () => get('/ai/analyze-profile'),
  getAdmissionProbability: (payload) => post('/ai/admission-probability', payload), // { university, gpa, ielts, workExp, publications, country }
  getScholarshipSuggestion: (payload) => post('/ai/scholarship-suggestion', payload), // { country, subject, gpa, studyLevel }
  compareUniversities: (payload) => post('/ai/compare-universities', payload), // { universities, subject, country }
  generateSOP: (payload) => post('/ai/generate-sop', payload), // { targetSubject, targetCountry, academicBackground, experience, keyAchievements }
  generateLOR: (payload) => post('/ai/generate-lor', payload), // { recommenderName, recommenderTitle, specialSkillFocused, studentName, subject }
  getCareerPaths: () => get('/ai/career-paths'),
  getMyDocuments: () => get('/ai/my-documents'),
};
