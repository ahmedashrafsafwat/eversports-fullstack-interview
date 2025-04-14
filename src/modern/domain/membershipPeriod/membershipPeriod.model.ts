import { v4 as uuidv4 } from 'uuid';
import { components } from '../../core/types/apiGenerated.interface';
import { MembershipPeriodState } from '../../core/types/apiGenerated.interface';

export type MembershipPeriodId = number;
export type MembershipPeriodUuid = string;
type MembershipId = components['schemas']['Membership']['id'];

interface IMembershipPeriodProps {
  id?: MembershipPeriodId;
  uuid?: MembershipPeriodUuid;
  membershipId: MembershipId;
  start: Date;
  end: Date;
  state: MembershipPeriodState;
}

export class MembershipPeriod {
  private readonly _id: MembershipPeriodId;
  private readonly _uuid: MembershipPeriodUuid;
  private readonly _membershipId: MembershipId;
  private readonly _start: Date;
  private readonly _end: Date;
  private _state: MembershipPeriodState;

  constructor(props: IMembershipPeriodProps) {
    this._id = props.id ?? 0; // Will be set by repository
    this._uuid = props.uuid ?? uuidv4();
    this._membershipId = props.membershipId;
    this._start = props.start;
    this._end = props.end;
    this._state = props.state;
  }

  // Getters
  get id(): MembershipPeriodId {
    return this._id;
  }

  get uuid(): MembershipPeriodUuid {
    return this._uuid;
  }

  get membershipId(): MembershipId {
    return this._membershipId;
  }

  get start(): Date {
    return new Date(this._start);
  }

  get end(): Date {
    return new Date(this._end);
  }

  get state(): MembershipPeriodState {
    return this._state;
  }

  set state(newState: MembershipPeriodState) {
    this._state = newState;
  }

  // Factory method
  public static create(props: IMembershipPeriodProps): MembershipPeriod {
    return new MembershipPeriod(props);
  }

  // To JSON for API responses
  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      uuid: this._uuid,
      membershipId: this._membershipId,
      start: this._start,
      end: this._end,
      state: this._state
    };
  }
}
