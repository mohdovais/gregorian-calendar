type ListboxState = {
	activeDescendant: string;
	multiple: boolean;
};

type InitializerArg = {};

function initializer(arg: InitializerArg): ListboxState {}

function store(state: ListboxState, action: unknown): ListboxState {
	return state;
}

export { store, initializer };
