import data from "./data/data.json"
import focusDocumentsData from "./data/focus-documents-data.json"
import keyPersonnelData from "./data/key-personnel-data.json"
import pastPerformanceData from "./data/past-performance-data.json"

import type { Task } from "./types/dashboard-types"

export const dashboardMockData: {
  data: Task[]
  focusDocumentsData: Task[]
  keyPersonnelData: Task[]
  pastPerformanceData: Task[]
} = {
  data: data as Task[],
  focusDocumentsData: focusDocumentsData as Task[],
  keyPersonnelData: keyPersonnelData as Task[],
  pastPerformanceData: pastPerformanceData as Task[],
}
