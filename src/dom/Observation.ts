export class Observation {
  constructor(
    public readonly target: Element | null,
    public readonly id: string,
    public readonly found: boolean,
    public readonly isNew: boolean,
    public readonly decorated: boolean,
    public readonly decorations: any[] = []
  ) {}

  // Whether the observed element is fully loaded and ready to be used
  isReady(): boolean {
    return this.found && this.isNew && this.decorated;
  }

  // Whether the observed element has been found, but not yet decorated with the extension's enhancements
  undecorated(): boolean {
    return this.found && this.isNew && !this.decorated;
  }

  // Where the element does not exist in the DOM
  static notFound(id: string): Observation {
    return new Observation(null, id, false, false, false);
  }
  // Where the element exists in the DOM, and has already been decorated with the extension's enhancements
  static foundExisting(id: string, element: Element): Observation {
    return new Observation(element, id, true, false, true);
  }
  // Where the element exists in the DOM, and has newly been decorated with the extension's enhancements
  static decorated(obs: Observation, decoration?: any): Observation {
    const decor = decoration
      ? [...obs.decorations, decoration]
      : [obs.decorations];
    return new Observation(
      obs.target,
      obs.id,
      obs.found,
      obs.isNew,
      true,
      decor
    );
  }
  // Where the element exists in the DOM, but has not been decorated with the extension's enhancements
  static notDecorated(id: string, element: Element): Observation {
    return new Observation(element, id, true, true, false);
  }
}
