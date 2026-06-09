export type UserRole =
  | "MEMBRE"
  | "RESPONSABLE"
  | "TRESORIER"
  | "FORMATEUR"
  | "ADMINISTRATEUR";

export type MembershipStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  matricule: string;
  filiere: string;
  niveau: string;
  phone: string;
  bio?: string | null;
  role: UserRole;
  membership: {
    status: MembershipStatus;
    memberId: string | null;
    academicYear: string;
  } | null;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type ApiMember = {
  id: string;
  firstName: string;
  lastName: string;
  filiere: string;
  niveau: string;
  memberId: string | null;
  status: MembershipStatus;
  initials: string;
};

export type ApiPendingMember = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  matricule: string;
  filiere: string;
  niveau: string;
  phone: string;
  academicYear: string | null;
  createdAt: string;
  initials: string;
};

export type ValidateMemberAction = "approve" | "reject";

export type StatsOverview = {
  activeMembers: number;
  pendingMembers: number;
  publishedFormations: number;
  upcomingEvents: number;
  publishedProjects: number;
  libraryResources: number;
  cotisationsReceived: number;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    transactionAt: string;
  }>;
  nextEvent: {
    id: string;
    title: string;
    startAt: string;
    location: string | null;
    posterUrl: string | null;
  } | null;
};

export type ApiFormation = {
  id: string;
  title: string;
  description: string;
  level: string;
  program: string;
  resources: string | null;
  published: boolean;
  createdAt: string;
};

export type ApiFormationDetail = ApiFormation & {
  quiz: { id: string; title: string; passScore: number } | null;
  certificate: { number: string; issuedAt: string } | null;
};

export type ApiQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

export type ApiQuiz = {
  id: string;
  title: string;
  passScore: number;
  questions: ApiQuizQuestion[];
};

export type ApiQuizResult = {
  passed: boolean;
  score: number;
  passScore: number;
  correctCount: number;
  totalQuestions: number;
  certificate: ApiCertificate | null;
};

export type ApiCertificate = {
  id: string;
  number: string;
  formationId: string;
  formationTitle: string;
  formationProgram: string;
  formationLevel: string;
  holderName: string;
  matricule: string;
  issuedAt: string;
  verified: boolean;
};

export type ApiCertificateVerify =
  | {
      valid: false;
      number: string;
      message: string;
    }
  | {
      valid: true;
      number: string;
      holderName: string;
      matricule: string;
      formationTitle: string;
      formationProgram: string;
      issuedAt: string;
    };

export type ApiEvent = {
  id: string;
  title: string;
  description: string;
  type: string;
  typeLabel: string;
  speaker: string | null;
  startAt: string;
  endAt: string | null;
  location: string | null;
  meetingLink: string | null;
  maxPlaces: number;
  posterUrl: string | null;
  published: boolean;
  registrationCount: number;
  spotsLeft: number;
  registered: boolean;
};

export type CreateFormationPayload = {
  title: string;
  description: string;
  level: string;
  program: string;
  resources?: string;
  published?: boolean;
};

export type CreateEventPayload = {
  title: string;
  description: string;
  type: string;
  speaker?: string;
  startAt: string;
  endAt?: string;
  location?: string;
  meetingLink?: string;
  maxPlaces: number;
  posterUrl?: string;
  published?: boolean;
};

export type FinanceSummary = {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  cotisationsReceived: number;
  chart: Array<{ month: string; income: number; expenses: number }>;
};

export type ApiFinanceTransaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  signedAmount: number;
  category: string;
  description: string;
  transactionAt: string;
  receiptUrl: string | null;
};

export type ApiCotisation = {
  id: string;
  amount: number;
  status: "UNPAID" | "PAID" | "PARTIAL";
  academicYear: string;
  paidAt: string | null;
  receiptNo: string | null;
  paymentMethod: string | null;
  paymentPhone: string | null;
  paymentReference: string | null;
};

export type PayCotisationPayload = {
  amount?: number;
  paymentMethod?: "ORANGE_MONEY" | "MTN_MOMO" | "SIMULATION";
  paymentPhone?: string;
};

export type CreateFinanceTransactionPayload = {
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  description: string;
  transactionAt?: string;
  receiptUrl?: string;
};

export type ApiProjectMember = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  initials: string;
};

export type ApiProject = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  screenshots: string | null;
  status: string;
  statusLabel: string;
  members: ApiProjectMember[];
  createdAt: string;
};

export type CreateProjectPayload = {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  screenshots?: string;
  status?: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
};

export type ApiResource = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  fileUrl: string | null;
  externalUrl: string | null;
  uploadedBy: string;
  createdAt: string;
};

export type CreateResourcePayload = {
  title: string;
  description?: string;
  category: string;
  fileUrl?: string;
  externalUrl?: string;
};

export type ConversationType = "DIRECT" | "ANNOUNCEMENT";

export type ApiConversationPreview = {
  id: string;
  type: ConversationType;
  title: string;
  subtitle: string;
  otherParticipant: {
    id: string;
    firstName: string;
    lastName: string;
    initials: string;
  } | null;
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
};

export type ApiChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  sent: boolean;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    initials: string;
  };
};
