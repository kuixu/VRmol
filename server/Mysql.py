#!/usr/bin/env python                                                                                                                                                                                                                                       
"""
# Author: XU Kui
# Created Time : Wed 26 Apr 2017 11:26:03 PM CST
 
# File Name: MysqlConn.py
# Description:
 
"""
 
 
import numpy as np
import os, sys 
# import mysql.connector
import mysql.connector
 
class Database():
    def __init__(self,database='rise'):
        self.conn = self.connect(database=database)
        self.cur = self.conn.cursor()
 
    def connect(self,database):
        conn = None
        try:
            conn = mysql.connector.connect(
                user='rise',
                password='xx',
                host='localhost',
                database=database,
                port='3306'
                )   
            print('Connected to the MySQL database <{}>\n'.format(database))
        except (Exception, mysql.connector.Error) as err:
            print(err)
            raise(err)
        return conn
 
    def execute(self, sql):
        try:
            self.cur.execute(sql)
            self.conn.commit()
        except (Exception, mysql.connector.Error) as err:
            print(err)
            # raise(err)
 
    def query(self,sql):
        pass
 
    def __del__(self):
        self.conn.close()
 
if __name__ == "__main__":
    db = Database()
