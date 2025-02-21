import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user"
import { Class } from "./class"

@Entity()
export class Invites {
    @PrimaryColumn()
    @OneToOne(type => User)
    @JoinColumn()
    inviter!: User

    @PrimaryColumn()
    @OneToOne(type => User)
    @JoinColumn()
    invitee!: User

    @PrimaryColumn()
    @OneToOne(type => Class)
    @JoinColumn()
    class!: Class
}
