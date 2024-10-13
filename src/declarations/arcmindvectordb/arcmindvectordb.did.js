export const idlFactory = ({ IDL }) => {
  const VecDoc = IDL.Record({
    'content' : IDL.Text,
    'embeddings' : IDL.Vec(IDL.Float32),
  });
  const VecQuery = IDL.Variant({ 'Embeddings' : IDL.Vec(IDL.Float32) });
  const PlainDoc = IDL.Record({ 'content' : IDL.Text });
  return IDL.Service({
    'add' : IDL.Func([VecDoc], [IDL.Text], []),
    'check_cycles_and_topup' : IDL.Func([], [], []),
    'delete' : IDL.Func([VecDoc], [], []),
    'get_owner' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'search' : IDL.Func(
        [VecQuery, IDL.Nat64],
        [IDL.Opt(IDL.Vec(PlainDoc))],
        ['query'],
      ),
    'size' : IDL.Func([], [IDL.Nat64], ['query']),
    'update_owner' : IDL.Func([IDL.Principal], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
