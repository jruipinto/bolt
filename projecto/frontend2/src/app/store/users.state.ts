import { State, StateContext } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';

@State<any>({
  name: 'users'
})
export class UsersState {
  @Receiver()
  public static setValue(ctx: StateContext<any>, action: EmitterAction<number>) {
    ctx.setState(action.payload);
  }
}
