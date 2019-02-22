import { State, StateContext } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';

@State<any>({
  name: 'encomendas'
})
export class EncomendasState {
  @Receiver()
  public static setValue(ctx: StateContext<any>, action: EmitterAction<number>) {
    ctx.setState(action.payload);
  }
}
