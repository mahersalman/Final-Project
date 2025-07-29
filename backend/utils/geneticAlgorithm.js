// geneticAlgorithm.js
const generateInitialPopulation = (employees, stations, populationSize) => {
  const population = [];
  for (let i = 0; i < populationSize; i++) {
    const assignment = {};
    const availableEmployees = [...employees];
    stations.forEach((station) => {
      if (availableEmployees.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * availableEmployees.length
        );
        assignment[station.station_id] =
          availableEmployees[randomIndex].person_id;
        availableEmployees.splice(randomIndex, 1);
      }
    });
    population.push(assignment);
  }
  return population;
};

const calculateFitness = (assignment, employees, stations, qualifications) => {
  let fitness = 0;
  Object.entries(assignment).forEach(([stationId, employeeId]) => {
    const station = stations.find((s) => s.station_id === stationId);
    const employee = employees.find((e) => e.person_id === employeeId);

    if (employee) {
      const employeeQualification = qualifications.find(
        (q) =>
          q.person_id === employeeId && q.station_name === station.station_name
      );
      fitness += employeeQualification ? employeeQualification.avg : 0;
    }
  });
  return fitness;
};

const selectParents = (population, fitnesses) => {
  const totalFitness = fitnesses.reduce((sum, fitness) => sum + fitness, 0);
  const randomValue = Math.random() * totalFitness;
  let sum = 0;
  for (let i = 0; i < population.length; i++) {
    sum += fitnesses[i];
    if (sum >= randomValue) {
      return population[i];
    }
  }
  return population[population.length - 1];
};

const crossover = (parent1, parent2) => {
  const child = {};
  Object.keys(parent1).forEach((key) => {
    child[key] = Math.random() < 0.5 ? parent1[key] : parent2[key];
  });
  return child;
};

const mutate = (assignment, employees, mutationRate) => {
  const mutatedAssignment = { ...assignment };
  Object.keys(mutatedAssignment).forEach((stationId) => {
    if (Math.random() < mutationRate) {
      const randomEmployee =
        employees[Math.floor(Math.random() * employees.length)];
      mutatedAssignment[stationId] = randomEmployee.person_id;
    }
  });
  return mutatedAssignment;
};

const geneticAlgorithm = (
  employees,
  stations,
  qualifications,
  populationSize = 100,
  generations = 100,
  mutationRate = 0.01
) => {
  let population = generateInitialPopulation(
    employees,
    stations,
    populationSize
  );

  for (let gen = 0; gen < generations; gen++) {
    const fitnesses = population.map((assignment) =>
      calculateFitness(assignment, employees, stations, qualifications)
    );
    const newPopulation = [];

    for (let i = 0; i < populationSize; i++) {
      const parent1 = selectParents(population, fitnesses);
      const parent2 = selectParents(population, fitnesses);
      let child = crossover(parent1, parent2);
      child = mutate(child, employees, mutationRate);
      newPopulation.push(child);
    }

    population = newPopulation;
  }

  const fitnesses = population.map((assignment) =>
    calculateFitness(assignment, employees, stations, qualifications)
  );
  const bestAssignmentIndex = fitnesses.indexOf(Math.max(...fitnesses));
  return population[bestAssignmentIndex];
};

// function to get top N employees for a station
const getTopEmployeesForStation = (employees, station, qualifications, n) => {
  const stationQualifications = qualifications.filter(
    (q) => q.station_name === station.station_name
  );
  const employeesWithQualifications = employees.map((employee) => {
    const qualification = stationQualifications.find(
      (q) => q.person_id === employee.person_id
    );
    return {
      ...employee,
      qualification: qualification ? qualification.avg : 0,
    };
  });

  return employeesWithQualifications
    .sort((a, b) => b.qualification - a.qualification)
    .slice(0, n);
};

const getAllSortedEmployeesForStation = (
  employees,
  station,
  qualifications
) => {
  const stationQualifications = qualifications.filter(
    (q) => q.station_name === station.station_name
  );
  const employeesWithQualifications = employees.map((employee) => {
    const qualification = stationQualifications.find(
      (q) => q.person_id === employee.person_id
    );
    return {
      ...employee,
      qualification: qualification ? qualification.avg : 0,
    };
  });

  // Filter out employees with no qualification for this station
  const eligibleEmployees = employeesWithQualifications.filter(
    (employee) => employee.qualification > 0
  );

  // Sort eligible employees by qualification in descending order
  return eligibleEmployees.sort((a, b) => b.qualification - a.qualification);
};

module.exports = { geneticAlgorithm, getAllSortedEmployeesForStation };
