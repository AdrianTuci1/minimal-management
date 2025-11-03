/**
 * Whiteboards pentru diferite tipuri de workspace
 * 
 * Structura:
 * - clinic/ - Whiteboard pentru clinică dentară (programări pe ore)
 * - hotel/ - Whiteboard pentru hotel (rezervări pe zile)
 * - fitness/ - Whiteboard pentru sală de fitness (pentru viitor)
 * 
 * Fiecare tip de workspace are propriul whiteboard adaptat la nevoile specifice:
 * - Clinic: programări pe ore, medici pe coloane
 * - Hotel: rezervări pe zile, camere pe rânduri
 * - Fitness: programări pe ore, clienți pe coloane
 */

export { default as ClinicWhiteboard } from './clinic'
export { default as HotelWhiteboard } from './hotel'
export { default as FitnessWhiteboard } from './fitness'

