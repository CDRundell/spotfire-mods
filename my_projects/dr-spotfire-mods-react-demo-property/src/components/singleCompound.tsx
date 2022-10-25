import React from 'react'



class SingleCompound extends React.Component<any, any> {
  render() {
    let { rows } = this.props


    return (
      rows.slice(0,1).map((row: any) => {
        const vals = Object.values(row.continuous("Y"))
        const stringVal:any = vals[1]

        return (
          <div>
            <p>{row.categorical("X").value()[0].key}</p>
            <p>{stringVal}</p>
          </div>
        )
      })
    )
  }
}

export { SingleCompound }
